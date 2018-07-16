import sys 
import time

from matplotlib.backends.backend_webagg import ServerThread
from numpy.testing.nose_tools.parameterized import make_method

from builtins import Exception
from numpy import str


class MuseServer(ServerThread):
    acc_x, acc_y, acc_z = .0, .0, .0
    EEG1, EEG2 = .0, .0
    hs1, hs2, hs3, hs4 = .4, .4, .4, .4
    isRecord = False
    def __init__(self):
        ServerThread.__init__(self, 5003)

    @make_method('/muse/acc', 'fff')
    def acc_callback(self, path, args):
        acc_x, acc_y, acc_z = args
        
    @make_method('/muse/horseshoe', 'ffff')
    def acc_callback(self, path, args):
        hs1, hs2, hs3, hs4 = args
        print (hs1, hs2, hs3, hs4)

    @make_method('/muse/eeg', 'ffff')
    def eeg_callback(self, path, args):
        l_ear, EEG1, EEG2, r_ear = args

    @make_method(None, None)
    def fallback(self, path, args, types, src):
        print ("Unknown message ", src.url, path, types, args)
        
    with codecs.open("C:/RecordingFiles/data.csv", 'a') as logfile:
        writer = csv.DictWriter(logfile)
        writer.writerow(EEG1, EEG2, acc_x, acc_y, acc_z)

try:
    server = MuseServer()
except Exception as err:
    print (err)
    sys.exit()

server.start()

if __name__ == "__main__":
    while 1:
        time.sleep(0.005)
