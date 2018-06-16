package app.datastream.eeg;

import static com.eeg_server.experiment.oddball.FileUtils.NEW_LINE;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import com.eeg_server.eegServer.EegData;
import com.eeg_server.eegServer.MuseSignals;
import com.eeg_server.eegServer.Type;
import com.eeg_server.experiment.oddball.FileUtils;
import com.eeg_server.oscP5.OscMessage;
import com.eeg_server.oscP5.OscP5;
import com.eeg_server.oscP5.OscProperties;
import com.google.common.collect.Lists;
import com.google.common.collect.Sets;
import app.common.MuseSignalEntity;

public class MuseOscServer {
	public static MuseSignalEntity EEG;
	public static boolean record;
	private List<EegData> messages = Lists.newLinkedList();
	Set<String> others = Sets.newHashSet();
	private OscP5 oscP5;

	public void startRecord() {
		record = false;
		if (oscP5 == null)
			oscP5 = new OscP5(this, "localhost", 5003, OscProperties.UDP);
	}

	public void stopRecord() {
		oscP5.dispose();
	}

	void oscEvent(OscMessage msg) {
		String name = msg.addrPattern();
		Type type = Type.getValue(name);

		prepareObjforUI(msg);
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
			others.add(str);
			return;
		case HORSE_SHOE:
			// System.out.println("signal quality:" + MuseSignals.asString(msg,
			// Type.HORSE_SHOE));
			return;
		case STRICT:
			return;
		case QUANTIZATION_EEG:
		case ALPHA_ABSOLUTE:
			EegData alphaAbs = new EegData(type.name(), timetag, serverCurrentTimestamp, msg.arguments());
			messages.add(alphaAbs);
			return;
		case BETA_ABSOLUTE:
			EegData BAbs = new EegData(type.name(), timetag, serverCurrentTimestamp, msg.arguments());
			messages.add(BAbs);
			return;
		case THETA_ABSOLUTE:
			EegData TAbs = new EegData(type.name(), timetag, serverCurrentTimestamp, msg.arguments());
			messages.add(TAbs);
			return;
		case DELTA_ABSOLUTE:
			EegData DAbs = new EegData(type.name(), timetag, serverCurrentTimestamp, msg.arguments());
			messages.add(DAbs);
			return;
		case GAMMA_ABSOLUTE:
			EegData GAbs = new EegData(type.name(), timetag, serverCurrentTimestamp, msg.arguments());
			messages.add(GAbs);
			return;
		case ALPHA_RELATIVE:
			EegData alphaRel = new EegData(type.name(), timetag, serverCurrentTimestamp, msg.arguments());
			messages.add(alphaRel);
			return;
		case BETA_RELATIVE:
			EegData BRel = new EegData(type.name(), timetag, serverCurrentTimestamp, msg.arguments());
			messages.add(BRel);
			return;
		case THETA_RELATIVE:
			EegData TRel = new EegData(type.name(), timetag, serverCurrentTimestamp, msg.arguments());
			messages.add(TRel);
			return;
		case DELTA_RELATIVE:
			EegData DRel = new EegData(type.name(), timetag, serverCurrentTimestamp, msg.arguments());
			messages.add(DRel);
			return;
		case GAMMA_RELATIVE:
			EegData GRel = new EegData(type.name(), timetag, serverCurrentTimestamp, msg.arguments());
			messages.add(GRel);
			return;
		case ALPHA_SESSION:
			EegData alphaSes = new EegData(type.name(), timetag, serverCurrentTimestamp, msg.arguments());
			messages.add(alphaSes);
			return;
		case BETA_SESSION:
			EegData BSes = new EegData(type.name(), timetag, serverCurrentTimestamp, msg.arguments());
			messages.add(BSes);
			return;
		case THETA_SESSION:
			EegData TSes = new EegData(type.name(), timetag, serverCurrentTimestamp, msg.arguments());
			messages.add(TSes);
			return;
		case DELTA_SESSION:
			EegData DSes = new EegData(type.name(), timetag, serverCurrentTimestamp, msg.arguments());
			messages.add(DSes);
			return;
		case GAMMA_SESSION:
			EegData GSes = new EegData(type.name(), timetag, serverCurrentTimestamp, msg.arguments());
			messages.add(GSes);
			return;
		case ACCELEROMETER:
			EegData dataAcc = new EegData(type.name(), timetag, serverCurrentTimestamp, msg.arguments());
			messages.add(dataAcc);
			return;
		case FFT0:
			EegData fft0 = new EegData(type.name(), timetag, serverCurrentTimestamp, msg.arguments());
			messages.add(fft0);
			return;
		case FFT1:
			EegData fft1 = new EegData(type.name(), timetag, serverCurrentTimestamp, msg.arguments());
			messages.add(fft1);
			return;
		case FFT2:
			EegData fft2 = new EegData(type.name(), timetag, serverCurrentTimestamp, msg.arguments());
			messages.add(fft2);
			return;
		case FFT3:
			EegData fft3 = new EegData(type.name(), timetag, serverCurrentTimestamp, msg.arguments());
			messages.add(fft3);
			return;
		default:
			EegData data = new EegData(type.name(), timetag, serverCurrentTimestamp, msg.arguments());
			messages.add(data);
		}
	}

	private static final String HEADER = "Timestamp,Data";

	public void dumpResults(String filename) {
		if (!record && messages.size() <= 0)
			return;
		try {
			final List<EegData> tmp = messages;
			messages = new ArrayList<EegData>();
			for (final EegData eegData : tmp) {
				String fileName = FileUtils.resolve(eegData.getType() + ".csv").toString();
				File f = new File(fileName);
				boolean newFile = false;
				if (!f.exists()) {
					f.createNewFile();
					newFile = true;
				}
				FileWriter writer = new FileWriter(fileName, true);
				if (newFile) {
					writer.write(HEADER);
					writer.write(NEW_LINE);
				}
				writer.append(FileUtils.formatCsvLine(eegData));
				writer.append(NEW_LINE);
				writer.flush();
				writer.close();
			}
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