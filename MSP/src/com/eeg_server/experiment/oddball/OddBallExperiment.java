package com.eeg_server.experiment.oddball;

import com.eeg_server.experiment.Experiment;

/**
 * @author Shiran Schwartz on 20/08/2016.
 */
public class OddBallExperiment extends Experiment {

    public OddBallExperiment(int intervalsBetweenSignalsMs, int randomSleepFactorMs, int numIterations, int percentageOfRareEvents) {
        super(intervalsBetweenSignalsMs, randomSleepFactorMs, numIterations, percentageOfRareEvents);
    }
}
