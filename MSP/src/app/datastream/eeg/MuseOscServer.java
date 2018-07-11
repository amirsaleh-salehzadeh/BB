package app.datastream.eeg;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.util.Set;

import app.common.EEG.Type;
import com.google.common.collect.Sets;
import app.common.MuseSignalEntity;
import app.common.EEG.EegData;
import app.common.utils.FileUtils;
import oscP5.OscMessage;
import oscP5.OscP5;
import oscP5.OscProperties;

public class MuseOscServer {
	public static MuseSignalEntity EEG;
	public static boolean record;
	Set<String> others = Sets.newHashSet();
	private OscP5 oscP5;
	public static Object[] labels;

	public static void main(String[] args) {
		MuseOscServer m = new MuseOscServer();
		m.startRecord();
		record = true;
	}

	public void startRecord() {
		record = false;
		if (oscP5 == null)
			oscP5 = new OscP5(this, "localhost", 5003, OscProperties.UDP);
		if (labels == null)
			labels = new Object[3];
	}

	public void stopRecord() {
		oscP5.dispose();
	}

	void oscEvent(OscMessage msg) {
		String name = msg.addrPattern();
		Type type = Type.getValue(name);
		// msg.addArguments(labels);
		// prepareObjforUI(msg);
		if (!record)
			return;
		long timetag = msg.timetag();
		long serverCurrentTimestamp = System.currentTimeMillis();
		switch (type) {
		case OTHER:
			String str = msg.addrPattern();
			if (others.contains(str)) {
				return;
			}
			// others.add(str);
			return;
		case HORSE_SHOE:
			System.out.println(msg.get(0).floatValue() + " " + msg.get(1).floatValue() + " " + msg.get(2).floatValue()
					+ " " + msg.get(3).floatValue());
		case ACCELEROMETER:
			EegData dataAcc = new EegData(type.name(), timetag, serverCurrentTimestamp, msg.arguments());
			dumpResults(dataAcc);
			return;
		case EEG:
			EegData eeg = new EegData(type.name(), timetag, serverCurrentTimestamp, msg.arguments());
			dumpResults(eeg);
			return;
		default:
			return;
		}
	}

	private static final String HEADER = "Timestamp";
	private static final String NEW_LINE = "\n";

	public void dumpResults(EegData eegData) {
		if (!record)
			return;
		try {
			String fileName = FileUtils.resolve(eegData.getType() + ".csv").toString();
			File f = new File(fileName);
			if (!f.exists()) {
				f.createNewFile();
			}
			FileWriter writer = new FileWriter(fileName, true);
			writer.append(FileUtils.formatCsvLine(eegData));
			writer.append(NEW_LINE);
			writer.flush();
			writer.close();
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	void prepareObjforUI(OscMessage msg) {
		if (EEG == null) {
			EEG = new MuseSignalEntity();
		}
		try {
			if (msg.checkAddrPattern("/muse/elements/delta_session_score") == true) {
				EEG.setDeltaABS(getVal(msg));
			}
			if (msg.checkAddrPattern("/muse/elements/theta_session_score") == true) {
				EEG.setTetaABS(getVal(msg));
			}
			if (msg.checkAddrPattern("/muse/elements/alpha_session_score") == true) {
				EEG.setAlphaABS(getVal(msg));
			}
			if (msg.checkAddrPattern("/muse/elements/beta_session_score") == true) {
				EEG.setBetaABS(getVal(msg));
			}
			if (msg.checkAddrPattern("/muse/elements/gamma_session_score") == true) {
				EEG.setGammaABS(getVal(msg));
			}
			if (msg.checkAddrPattern("/muse/elements/horseshoe") == true) {
				float[] tmpHS = { msg.get(0).floatValue(), msg.get(1).floatValue(), msg.get(2).floatValue(),
						msg.get(3).floatValue() };
				EEG.setHorseShoes(tmpHS);
			}
			if (msg.checkAddrPattern("/muse/batt") == true) {
				EEG.setBattery(msg.get(0).intValue());
				EEG.setTemprature(msg.get(3).intValue());
			}
			if (msg.checkAddrPattern("/muse/elements/touching_forehead") == true) {
				if (msg.get(0).intValue() == 1) {
					EEG.setForeheadConneted(true);
				} else
					EEG.setForeheadConneted(false);
			}
			if (msg.checkAddrPattern("/muse/drlref") == true) {
				EEG.setDRL(msg.get(0).floatValue());
				EEG.setREF(msg.get(1).floatValue());
			}
			if (msg.checkAddrPattern("/muse/acc") == true) {
				EEG.setACC_X(msg.get(0).floatValue());
				EEG.setACC_Y(msg.get(1).floatValue());
				EEG.setACC_Z(msg.get(2).floatValue());
			}
			if (msg.checkAddrPattern("/muse/elements/blink") == true) {
				if (msg.get(0).intValue() == 1) {
					EEG.setBlink(true);
				} else
					EEG.setBlink(false);
			}
			if (msg.checkAddrPattern("/muse/elements/experimental/concentration") == true) {
				EEG.setConcentration(msg.get(0).floatValue());
				EEG.setRNN(msg.get(0).floatValue());
			}
			if (msg.checkAddrPattern("/muse/elements/experimental/mellow") == true) {
				EEG.setMeditation(msg.get(0).floatValue());
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	private float getVal(OscMessage msg) {
		float val = 0;
		int counter = 0;
		if (msg.get(0) != null && msg.get(0).floatValue() != 0 && !Float.isNaN(msg.get(0).floatValue())) {
			val += Math.abs(msg.get(0).floatValue());
			counter++;
		}
		if (msg.get(1) != null && msg.get(1).floatValue() != 0 && !Float.isNaN(msg.get(1).floatValue())) {
			val += Math.abs(msg.get(1).floatValue());
			counter++;
		}
		if (msg.get(2) != null && msg.get(2).floatValue() != 0 && !Float.isNaN(msg.get(2).floatValue())) {
			val += Math.abs(msg.get(2).floatValue());
			counter++;
		}
		if (msg.get(3) != null && msg.get(3).floatValue() != 0 && !Float.isNaN(msg.get(3).floatValue())) {
			val += Math.abs(msg.get(3).floatValue());
			counter++;
		}
		val = val / counter;
		if (Float.isNaN(val))
			return 0;
		else
			return val;
	}
}