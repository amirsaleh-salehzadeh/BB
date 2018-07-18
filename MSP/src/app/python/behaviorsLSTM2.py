import pandas as pd
import numpy as np
import os
import pickle
from keras.utils.vis_utils import plot_model
from keras.layers.recurrent import LSTM
import matplotlib.pyplot as plt
from sklearn.preprocessing import MinMaxScaler
from keras.models import Sequential
from keras.layers.core import Dense, Dropout, Activation, Flatten
from keras.callbacks import CSVLogger, EarlyStopping, TerminateOnNaN, \
    ReduceLROnPlateau, ModelCheckpoint
import tensorflow as tf
from keras import backend as K
import random as rn
from numpy.random.mtrand import shuffle
import codecs
import csv
from math import floor
import datetime
from biosppy.signals.tools import band_power
from sklearn.preprocessing.data import normalize
from keras.engine.input_layer import Input
from keras.optimizers import Adam

os.environ["CUDA_DEVICE_ORDER"] = "PCI_BUS_ID"  # see issue #152
os.environ["CUDA_VISIBLE_DEVICES"] = ""
os.environ['PYTHONHASHSEED'] = '0'
np.random.seed(3)
rn.seed(12345)
session_conf = tf.ConfigProto(intra_op_parallelism_threads=1, inter_op_parallelism_threads=1)
config = tf.ConfigProto()
config.gpu_options.allow_growth = True
sess = tf.Session(config=config)
K.set_session(sess)
 
tf.set_random_seed(1234)
classes = 2
sess = tf.Session(graph=tf.get_default_graph(), config=session_conf)
K.set_session(sess)

rootFolder = "C:/RecordingFiles/"
slidingWindowSize = 50

def get_filepaths(mainfolder):
    training_filepaths = {}
    folders = os.listdir(mainfolder)
    for folder in folders:
        fpath = mainfolder + folder
        if os.path.isdir(fpath) and "ACC" not in folder:
            filenames = os.listdir(fpath)
            filenames = [x for x in filenames if ".file" not in x and "png" not in x]
            for filename in filenames[:len(filenames)]:
                fullpath = fpath + "/" + filename
                training_filepaths[fullpath] = folder
    return training_filepaths  


def get_labels(mainfolder):
    labels = {}
    label = 0
    for folder in os.listdir(mainfolder):
        fpath = mainfolder + folder
        if os.path.isdir(fpath) and "ACC" not in folder:
            labels[folder] = label
            label += 1
    return labels


def get_row_data(fp, labels, folders):
    if(os.path.isfile(fp + "filtered.file")):
        with open(fp + "filtered.file", "rb") as f:
            dump = pickle.load(f)
            return dump[0], dump[1], dump[2]
    file_dir = folders[fp]
    datasignals = pd.read_csv(filepath_or_buffer=fp, sep=',',
                              dtype='float', names=["EEG1", "EEG2", "Acc_X", "Acc_Y", "Acc_Z"])
    datasignals = datasignals.drop_duplicates(keep=False)
    drawMe(xVal=datasignals, yVal=None, title=file_dir, xlabel="time-steps",
           ylabel="volts (mV)", legend=['train', 'test'], save=True,
           fileName=fp + "-raw.png", show=False)
    low = .01
    high = .99
    quant_df = datasignals.quantile([low, high])
    datasignals = datasignals[datasignals['EEG1'].between(
        quant_df.loc[low, 'EEG1'], quant_df.loc[high, 'EEG1']) & 
        datasignals['EEG2'].between(
            quant_df.loc[low, 'EEG2'], quant_df.loc[high, 'EEG2']) & 
        datasignals['Acc_X'].between(
        quant_df.loc[low, 'Acc_X'], quant_df.loc[high, 'Acc_X']) & 
        datasignals['Acc_Y'].between(
        quant_df.loc[low, 'Acc_Y'], quant_df.loc[high, 'Acc_Y']) & 
        datasignals['Acc_Z'].between(
        quant_df.loc[low, 'Acc_Z'], quant_df.loc[high, 'Acc_Z'])]
    drawMe(xVal=datasignals, yVal=None, title=file_dir, xlabel="time-steps",
           ylabel="volts (mV)", legend=['train', 'test'], save=True,
           fileName=fp + "-filtered.png", show=False)
    one_hot = np.zeros(3)
    label = labels[file_dir]
    one_hot[label] = 1
    with open(fp + "filtered.file", "wb") as f:
        pickle.dump([datasignals, one_hot, label], f, pickle.HIGHEST_PROTOCOL)
    return datasignals, one_hot, label


def build_inputs(files_list, accel_labels, file_label_dict):
    X_seq = []
    y_seq = []
    labels = []
    if(os.path.isfile(rootFolder + "experim.file")):
        with open(rootFolder + "experim.file", "rb") as f:
            dump = pickle.load(f)
            return dump[0], dump[1], dump[2]
    else:
        for path in files_list:
            raw_data, target, target_label = get_row_data(path, accel_labels, file_label_dict)
            raw_data, indx = get_features(raw_data, path)
            tmp = pd.DataFrame(normalize(raw_data, axis=0, norm='max'))
            tmp.columns = raw_data.columns
            tmp.to_csv(path_or_buf=path + "Normalized.csv", sep=',',
                na_rep='', float_format=None, columns=None, header=True,
                index=True, index_label=None, mode='w', encoding=None,
                compression=None, quoting=None, quotechar='"', line_terminator='\n',
                chunksize=None, tupleize_cols=None, date_format=None, doublequote=True,
                escapechar=None)
#                 tmp = pd.DataFrame(columns=[])
            tmp = tmp[['mean', 'skew']]
            processedFeatures = vectorize(tmp)
            for inputs in range(len(processedFeatures)):
                X_seq.append(processedFeatures[inputs])
                y_seq.append(list(target))
                labels.append(target_label)
        X_ = pd.DataFrame(X_seq)
        y_ = pd.DataFrame(y_seq)
        labels = pd.DataFrame(labels)
    with open(rootFolder + "experim.file", "wb") as f:
        pickle.dump([X_, y_, labels], f, pickle.HIGHEST_PROTOCOL)
    return X_, y_, labels

def vectorize(normed):
    sequences = [normed[i:i + slidingWindowSize] for i in range(len(normed) - slidingWindowSize)]
    shuffle(sequences)
    return sequences

def get_features(normed, fp):
    if(os.path.isfile(fp + "all-processed.file")):
        with open(fp + "all-processed.file", "rb") as f:
            dump = pickle.load(f)
            return dump[0], dump[1]
    bands = [[0, 4], [4, 8], [8, 10], [10, 13],
            [13, 25], [25, 40]]
    overlap = 0.99
    sampling_rate = 200
    size = 0.25
    size = int(size * sampling_rate)
    min_pad = 1024
    pad = None
    if size < min_pad:
        pad = min_pad - size
    step = size - int(overlap * size)
    length = len(normed)
    if step is None:
        step = size
    nb = 1 + (length - size) // step
    index = []
    values = []
    fcn_kwargs = {'sampling_rate': sampling_rate, 'bands': bands, 'pad': pad}
    for i in range(nb):
        start = i * step
        stop = start + size
        index.append(start)
        out = _power_features(normed[start:stop], **fcn_kwargs)
        values.append(out)
    values = pd.concat(values)
    index = np.array(index, dtype='int')
    values = values.dropna()
#     values.to_csv(path_or_buf=fp + "power-bands-processed-CSV.csv", sep=',',
#               na_rep='', float_format=None, columns=None, header=True,
#               index=True, index_label=None, mode='w', encoding=None,
#               compression=None, quoting=None, quotechar='"', line_terminator='\n',
#               chunksize=None, tupleize_cols=None, date_format=None, doublequote=True,
#               escapechar=None)
    names = ['bands', 'mean', 'standard deviation', 'variance', 'skew', 'median']
    featuredVals = pd.concat([values, values.rolling(slidingWindowSize).mean(), values.rolling(slidingWindowSize).std(),
                              values.rolling(slidingWindowSize).var(), values.rolling(slidingWindowSize).skew(),
                              values.rolling(slidingWindowSize).median()], keys=names, axis=1)
    res = pd.DataFrame(featuredVals.fillna(0.0))
    with open(fp + "all-processed.file", "wb") as f:
        pickle.dump([res, index], f, pickle.HIGHEST_PROTOCOL)
    return res, index


def _power_features(signal=None, sampling_rate=200., bands=None, pad=0):
    nch = signal.shape[1]
    out = []
    sourceLabels = []
    featureLabels = []
    sourceSensor = ["Left", "Right", "X", "Y", "Z"]
    featureColumns = ['delta', 'theta', 'alpha_low', 'alpha_high', 'beta',
                     'gamma', 'sensor']
    for i in range(nch):
        if(i <= 1):
            freqs, power = power_spectrum(signal=signal.iloc[:, i],
                                             sampling_rate=sampling_rate,
                                             pad=pad,
                                             pow2=False,
                                             decibel=True)
            for j, b in enumerate(bands):
                avg, = band_power(freqs=freqs,
                                     power=power,
                                     frequency=b,
                                     decibel=False)
                out.append(avg)
                sourceLabels.append(sourceSensor[i])
                featureLabels.append((sourceSensor[i], featureColumns[j]))
        out.append(abs(signal.iloc[signal.shape[0] - 1:, i].values[0]))
        featureLabels.append((sourceSensor[i], 'sensor'))
        sourceLabels.append(sourceSensor[i])
    idx = pd.MultiIndex.from_tuples(featureLabels, names=['sensor', 'feature'])
    out = pd.DataFrame(np.array(out), index=idx)
    return out.transpose()


def power_spectrum(signal=None,
                   sampling_rate=1000.,
                   pad=None,
                   pow2=False,
                   decibel=True):
    if signal is None:
        raise TypeError("Please specify an input signal.")
    npoints = len(signal)
    if pad is not None:
        if pad >= 0:
            npoints += pad
        else:
            raise ValueError("Padding must be a positive integer.")
    if pow2:
        npoints = 2 ** (np.ceil(np.log2(npoints)))
    Nyq = float(sampling_rate) / 2
    hpoints = npoints // 2
    freqs = np.linspace(0, Nyq, hpoints)
    power = np.abs(np.fft.fft(signal, npoints)) / npoints
    power = power[:hpoints]
    power[1:] *= 2
    power = np.power(power, 2)
    if decibel:
        power = 10. * np.log10(power)
    return freqs, abs(power)


def drawMe(yVal=None, xVal=None, title="title", xlabel="xlabel", ylabel="ylabel", legend=["", ""], save=False,
           fileName="fileName", show=False):
    if(yVal != None):
        plt.plot(yVal)
    plt.plot(xVal)
    plt.title(title)
    plt.ylabel(ylabel)
    plt.xlabel(xlabel)
    if(legend != None):
        plt.legend(legend, loc='upper left')
    if(save):
        plt.savefig(fileName)
    if(show):
        plt.show()
    plt.close()


def build_model(X_train, X_test, Y_train, noLSTM, train_labels):
    model = Sequential()
    model.reset_states()
    with codecs.open(rootFolder + "training.csv", 'a') as logfile:
        fieldnames = ['lstm1', 'lstm2', 'dense1', 'dense2', 'dense3']
        writer = csv.DictWriter(logfile, fieldnames=fieldnames)
        writer.writerow({'lstm1': noLSTM[0], 'lstm2': noLSTM[1],
                         'dense1': noLSTM[2], 'dense2': noLSTM[3] , 'dense3': noLSTM[4]})
    
    # input
    model.add(LSTM(noLSTM[0], activation='tanh', recurrent_activation='hard_sigmoid', \
        use_bias=True, kernel_initializer='glorot_uniform', \
        recurrent_initializer='orthogonal', \
        unit_forget_bias=True, kernel_regularizer=None, \
        recurrent_regularizer=None, \
        bias_regularizer=None, activity_regularizer=None, \
        kernel_constraint=None, recurrent_constraint=None, \
        bias_constraint=None, dropout=0.0, recurrent_dropout=0.0, \
        implementation=1, return_sequences=True, return_state=False, \
        go_backwards=True, stateful=False, unroll=False, \
        input_shape=(slidingWindowSize, X_train.shape[1])))
    model.add(Dropout(0.5))
    if(noLSTM[1] != 0):
        model.add(LSTM(noLSTM[1], activation='tanh', recurrent_activation='hard_sigmoid', \
            use_bias=True, kernel_initializer='glorot_uniform', \
            recurrent_initializer='orthogonal', \
            unit_forget_bias=True, kernel_regularizer=None, \
            recurrent_regularizer=None, \
            bias_regularizer=None, activity_regularizer=None, \
            kernel_constraint=None, recurrent_constraint=None, \
            bias_constraint=None, dropout=0.0, recurrent_dropout=0.0, \
            implementation=1, return_sequences=False, return_state=False, \
            go_backwards=False, stateful=False, unroll=False, \
            input_shape=(slidingWindowSize, X_train.shape[1])))
        model.add(Dropout(0.5))
    # dense
    if(noLSTM[2] != 0):
        model.add(Dense(noLSTM[2], activation='tanh', use_bias=True))
    if(noLSTM[3] != 0):
            model.add(Dense(noLSTM[3], activation='tanh', use_bias=True))
    if(noLSTM[4] != 0):
            model.add(Dense(noLSTM[4], activation='tanh', use_bias=True))
        
    model.add(Dropout(0.5))
    model.add(Flatten())
    model.add(Dense(3))
    model.add(Activation('softmax'))

#   ['acc', 'loss', 'val_acc', 'val_loss']
    opt = Adam(lr=0.0011, decay=0.001)
    model.compile(optimizer=opt, loss='categorical_crossentropy', metrics=['accuracy'])
   
    fnametmp = rootFolder + "plot-{}-{}-{}.png".format("Model", noLSTM[0], noLSTM[1])
    plot_model(model, to_file=fnametmp, show_shapes=True,
               show_layer_names=True, rankdir='TB')
    return
    epoch_count = 50
    _patience = min(30, max(epoch_count // 5, 20))
    early_stopping = EarlyStopping(monitor='val_loss', min_delta=0,
                                   patience=_patience, verbose=1, mode='auto')
    tn = TerminateOnNaN()
    reduce_lr = ReduceLROnPlateau(monitor='val_loss', factor=0.2, min_lr=1e-7, verbose=1)
    checkpoint_path = os.path.join(rootFolder, "weights.best_{}_{}_{}.hdf5".format("model", noLSTM[0], noLSTM[1]))
    checkpoint = ModelCheckpoint(checkpoint_path, monitor='val_acc', verbose=1,
                                 save_best_only=True, mode='max')
    csv_logger = CSVLogger(rootFolder + 'training.csv', append=True)
    early_stop = EarlyStopping(monitor='val_acc', patience=1, verbose=2, mode='auto')
    callback_fns = [early_stopping, tn, csv_logger, checkpoint, reduce_lr]
    history = model.fit(X_train, Y_train, batch_size=1, epochs=50,
              callbacks=callback_fns, validation_split=0.2, shuffle=True)
    
    fnametmp = rootFolder + "model_{}_{}_{}".format("Model", noLSTM[0], noLSTM[1])
    model.save_weights(fnametmp + '.h5')
    with open(fnametmp + '.json', 'w') as f:
        f.write(model.to_json())
    fnametmp = "plot-{}-{}-{}.png".format("model-accuracy", noLSTM[0], noLSTM[1])
    drawMe(yVal=history.history['acc'], xVal=history.history['val_acc'],
           title='model accuracy', xlabel='epoch', ylabel='accuracy', legend=['train', 'test'], save=True,
           fileName=fnametmp, show=False)
    fnametmp = "plot-{}-{}-{}.png".format("model-loss", noLSTM[0], noLSTM[1])
    drawMe(yVal=history.history['loss'], xVal=history.history['val_loss'],
           title='model loss', xlabel='epoch', ylabel='loss', legend=['train', 'test'], save=True,
           fileName=fnametmp, show=False)
#     pred = model.predict(X_test)
#     compute_accuracy(pred, train_labels)


def compute_accuracy(predictions, y_labels):
    predicted_labels = []
    for prediction in predictions:
        prediction_list = list(prediction)
        predicted_labels.append(prediction_list.index(max(prediction_list)))
    correct = 0
    for label in range(len(predicted_labels)):
        print("Predicted label: {}; Actual label: {}".format(predicted_labels[label], y_labels[label]))
        if predicted_labels[label] == y_labels[label]:
            correct += 1
    accuracy = 100 * (correct / len(predicted_labels))
    print("Predicted {} out of {} correctly for an Accuracy of {}%".format(correct, len(predicted_labels), accuracy))
    return


if __name__ == '__main__':
    activity_labels = get_labels(rootFolder)
    training_dict = get_filepaths(rootFolder)
    training_files = list(training_dict.keys())
    X_train, y_train, train_labels = build_inputs(
        training_files,
        activity_labels,
        training_dict)
    tmpX = np.array(X_train)
    tmpY = np.array(y_train)
    xsize = X_train.shape[1] - int((X_train.shape[1] - 3) / 3)
    archs = [[32, 0, xsize, 0, 0],
             [128, 0, xsize, 0, 0],
             [32, 0, xsize, xsize - int((X_train.shape[1] - 3) / 3), 0],
             [128, 0, xsize, xsize - int((X_train.shape[1] - 3) / 3), 0],
             [32, 0, xsize, xsize - int((X_train.shape[1] - 3) / 3), 
                            xsize - int(2*(X_train.shape[1] - 3) / 3)],
             [128, 0, xsize, xsize - int((X_train.shape[1] - 3) / 3), 
                            xsize - int(2*(X_train.shape[1] - 3) / 3)],
             [128, 32, xsize, 0, 0],
             [128, 128, xsize, 0, 0],
             [128, 32, xsize, xsize - int((X_train.shape[1] - 3) / 3), 0],
             [128, 128, xsize, xsize - int((X_train.shape[1] - 3) / 3), 0],
             [128, 32, xsize, xsize - int((X_train.shape[1] - 3) / 3), 
                            xsize - int(2*(X_train.shape[1] - 3) / 3)],
             [128, 128, xsize, xsize - int((X_train.shape[1] - 3) / 3), 
                            xsize - int(2*(X_train.shape[1] - 3) / 3)]]
    X_test = tmpX[0:int(floor(0.2 * len(tmpX))), :]
    
    for q in range(len(archs)):
        build_model(X_train, X_test, y_train, np.array(archs[q]), train_labels)
        print(archs[q])

