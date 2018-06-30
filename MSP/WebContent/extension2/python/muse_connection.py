import sys 
import time

from matplotlib.backends.backend_webagg import ServerThread
from numpy.testing.nose_tools.parameterized import make_method

from liblo import *
from builtins import Exception


class MuseServer(ServerThread):
    #listen for messages on port 5000
    def __init__(self):
        ServerThread.__init__(self, 5000)

    #receive accelrometer data
    @make_method('/muse/acc', 'fff')
    def acc_callback(self, path, args):
        acc_x, acc_y, acc_z = args
        print (path, acc_x, acc_y, acc_z)

    #receive EEG data
    @make_method('/muse/eeg', 'ffff')
    def eeg_callback(self, path, args):
        l_ear, l_forehead, r_forehead, r_ear = args
        print (path, l_ear, l_forehead, r_forehead, r_ear)

    #handle unexpected messages
    @make_method(None, None)
    def fallback(self, path, args, types, src):
        print ("Unknown message ",src.url, path, types, args)

try:
    server = MuseServer()
except Exception err::
    print str(err)
    sys.exit()


server.start()

if __name__ == "__main__":
    while 1:
        time.sleep(1)