package com.eeg_server.experiment.oddball;

import javax.sound.sampled.Clip;

/**
 * @author Shiran Schwartz on 20/08/2016.
 */
class Helpers {


    static void playSoundAudioSystem(Clip clip, EventListener listener) {
        try {
            clip.setFramePosition(0);
            clip.addLineListener(listener);
            clip.start();
//            clip.drain();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
