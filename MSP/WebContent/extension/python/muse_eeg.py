import argparse

from pythonosc import dispatcher
from pythonosc import osc_server

_x, _y, _z = .0, .0, .0
EEG1, EEG2 = .0, .0
isRecording = False

def acc_handler(unused_addr, args, acc_x, acc_y, acc_z):
    _x, _y, _z = acc_x, acc_y, acc_z

    
def hs_handler(unused_addr, args, hs1, hs2, hs3, hs4):
    _hs2, _hs3 = hs2, hs3
    if(_hs2 == 1.0 and _hs3 == 1.0):
        isRecording = True
    print (hs1, hs2, hs3, hs4)


def eeg_handler(unused_addr, args, l_ear, EEG1, EEG2, r_ear):
    if(isRecording):
        print(EEG1, EEG2, _x, _y, _z)
        with codecs.open("C:/RecordingFiles/data.csv", 'a') as logfile:
            writer = csv.DictWriter(logfile)
            writer.writerow(EEG1, EEG2, _x, _y, _z)


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--ip",
                        default="localhost",
                        help="The ip to listen on")
    parser.add_argument("--port",
                        type=int,
                        default=5003,
                        help="The port to listen on")
    args = parser.parse_args()

    dispatcher = dispatcher.Dispatcher()
    dispatcher.map("/debug", print)
    dispatcher.map("/muse/eeg", eeg_handler, "EEG")
    dispatcher.map("/muse/acc", acc_handler, "ACC")
    dispatcher.map("/muse/elements/horseshoe", hs_handler, "HSH")

    server = osc_server.ThreadingOSCUDPServer(
        (args.ip, args.port), dispatcher)
    print("Serving on {}".format(server.server_address))
    server.serve_forever()
    
