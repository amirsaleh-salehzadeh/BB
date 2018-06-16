package com.eeg_server.experiment.simplerecord;

import com.eeg_server.eegServer.EegServer;
import com.eeg_server.eegServer.MuseEegServer;
import com.eeg_server.experiment.ExperimentType;

import java.io.IOException;

/**
 * @author shiran Schwartz on 02/12/2016.
 */
public class RecordEeg {

    public static void main(String args[]) throws InterruptedException, IOException {
        System.setProperty("java.awt.headless", "true");
        EegServer server = new MuseEegServer();
        server.startRecord();
        Thread.sleep(10000);
        server.stopRecord();
        server.dumpResults(ExperimentType.SimpleRecord.name());
        server.close();
    }


}
