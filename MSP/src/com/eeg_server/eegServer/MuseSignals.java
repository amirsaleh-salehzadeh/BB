package com.eeg_server.eegServer;

import com.eeg_server.oscP5.OscMessage;
import com.eeg_server.utils.TimeUtils;

import java.util.Arrays;

/**
 * @author shiran Schwartz on 01/10/2016.
 */
public class MuseSignals {
	static float[] parseEeg(OscMessage msg) {
		float[] floats = new float[5];
		for (int i = 0; i < 5; i++) {
			floats[i] = msg.get(i).floatValue();
		}
		return floats;
	}

	static int parseQuantization(OscMessage msg) {
		return msg.get(0).intValue();
	}

	static String asString(Object[] arguments) {
		try {
			String array = Arrays.toString(arguments);
			if (arguments.length > 0) {
				return array.substring(1, array.length() - 1);
			}
			return array;
		} catch (Exception e) {
			return "";
		}
	}

	public static String asString(OscMessage msg, Type t) {
		return String.format("%s", asString(msg.arguments()));
	}
}
