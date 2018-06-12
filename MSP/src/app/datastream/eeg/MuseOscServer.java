package app.datastream.eeg;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import org.codehaus.jackson.JsonGenerationException;
import org.codehaus.jackson.map.JsonMappingException;
import org.codehaus.jackson.map.ObjectMapper;

import com.google.gson.Gson;

import app.AIengine.dataprepration.RecordData;
import app.common.AccelerometerENT;
import app.common.MuseSignalEntity;
import oscP5.*;

public class MuseOscServer {
	public static MuseSignalEntity EEG;
	public static AccelerometerENT ACC;
	public static OscP5 museServer;
	public static boolean record;
	private static HashMap<String, String> EEDData;
	private static HashMap<String, Object> bandSessionData;
	private static HashMap<String, Object> bandAbsData;
	private static HashMap<String, Object> bandRelativeData;

	void oscEvent(OscMessage msg) {
		if (EEG == null) {
			EEG = new MuseSignalEntity();
			ACC = new AccelerometerENT();
			EEDData = new HashMap<>();

		}
		if (msg.checkAddrPattern("/muse/fft")) {
			for (int i = 0; i < 129; i++) {
				System.out.print("EEG on channel " + i + ": " + msg.get(i).floatValue() + "\n");
			}
		}
		if (msg.checkAddrPattern("/muse/eeg") == true) {
			if (record) {
				HashMap<String, Float> EEGTMP = new HashMap<String, Float>();
				EEGTMP.put("1", msg.get(0).floatValue());
				EEGTMP.put("2", msg.get(1).floatValue());
				EEGTMP.put("3", msg.get(2).floatValue());
				EEGTMP.put("4", msg.get(3).floatValue());
				Gson g = new Gson();
				RecordData.recordMainTask(g.toJson(EEGTMP), true, "RowEEG");
			}
			EEG.setEEG1(msg.get(0).floatValue());
			EEG.setEEG2(msg.get(1).floatValue());
			EEG.setEEG3(msg.get(2).floatValue());
			EEG.setEEG4(msg.get(3).floatValue());
		}
		if (msg.checkAddrPattern("/muse/elements/low_freqs_absolute") == true) {
			EEG.setLowFreqABS(getVal(msg));
			if (record) {
				HashMap<String, Float> tmp = new HashMap<String, Float>();
				tmp.put("1", msg.get(0).floatValue());
				tmp.put("2", msg.get(1).floatValue());
				tmp.put("3", msg.get(2).floatValue());
				tmp.put("4", msg.get(3).floatValue());
				tmp.put("5", getVal(msg));
				bandAbsData.put("l", tmp);
			}
		}
		if (msg.checkAddrPattern("/muse/elements/delta_absolute") == true) {
			EEG.setDeltaABS(getVal(msg));
			if (record) 
				bandAbsData.put("d", recordTheBand(msg));
		}
		if (msg.checkAddrPattern("/muse/elements/theta_absolute") == true) {
			EEG.setTetaABS(getVal(msg));
			if (record) 
				bandAbsData.put("t", recordTheBand(msg));
		}
		if (msg.checkAddrPattern("/muse/elements/alpha_absolute") == true) {
			EEG.setAlphaABS(getVal(msg));
			if (record) 
				bandAbsData.put("a", recordTheBand(msg));
		}
		if (msg.checkAddrPattern("/muse/elements/beta_absolute") == true) {
			EEG.setBetaABS(getVal(msg));
			if (record) 
				bandAbsData.put("b", recordTheBand(msg));
		}
		if (msg.checkAddrPattern("/muse/elements/gamma_absolute") == true) {
			EEG.setGammaABS(getVal(msg));
			if (record) 
				bandAbsData.put("g", recordTheBand(msg));
		}
		if (msg.checkAddrPattern("/muse/elements/low_freqs_relative") == true) {
			EEG.setLowFreqR(getVal(msg));
			if (record) 
				bandRelativeData.put("l", recordTheBand(msg));
		}
		if (msg.checkAddrPattern("/muse/elements/delta_relative") == true) {
			if (record) 
				bandRelativeData.put("d", recordTheBand(msg));
		}
		if (msg.checkAddrPattern("/muse/elements/theta_relative") == true) {
			EEG.setTetaR(getVal(msg));
			if (record) 
				bandRelativeData.put("t", recordTheBand(msg));
		}
		if (msg.checkAddrPattern("/muse/elements/alpha_relative") == true) {
			EEG.setAlphaR(getVal(msg));
			if (record) 
				bandRelativeData.put("a", recordTheBand(msg));
		}
		if (msg.checkAddrPattern("/muse/elements/beta_relative") == true) {
			EEG.setBetaR(getVal(msg));
			if (record) 
				bandRelativeData.put("b", recordTheBand(msg));
		}
		if (msg.checkAddrPattern("/muse/elements/gamma_relative") == true) {
			EEG.setGammaR(getVal(msg));
			if (record) 
				bandRelativeData.put("g", recordTheBand(msg));
		}
		if (msg.checkAddrPattern("/muse/elements/delta_session_score") == true) {
			EEG.set_delta(getVal(msg));
			if (record) 
				bandSessionData.put("d", recordTheBand(msg));
		}
		if (msg.checkAddrPattern("/muse/elements/theta_session_score") == true) {
			EEG.set_teta(getVal(msg));
			if (record) 
				bandSessionData.put("t", recordTheBand(msg));
		}
		if (msg.checkAddrPattern("/muse/elements/alpha_session_score") == true) {
			EEG.set_alpha(getVal(msg));
			if (record) 
				bandSessionData.put("a", recordTheBand(msg));
		}
		if (msg.checkAddrPattern("/muse/elements/beta_session_score") == true) {
			EEG.set_beta(getVal(msg));
			if (record) 
				bandSessionData.put("b", recordTheBand(msg));
		}
		if (msg.checkAddrPattern("/muse/elements/gamma_session_score") == true) {
			EEG.set_gamma(getVal(msg));
			if (record) 
				bandSessionData.put("g", recordTheBand(msg));
		}
		if (msg.checkAddrPattern("/muse/elements/horseshoe") == true) {
			float[] tmp = { msg.get(0).floatValue(), msg.get(1).floatValue(), msg.get(2).floatValue(),
					msg.get(3).floatValue() };
			EEG.setHorseShoes(tmp);
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
			AccelerometerENT newACC = new AccelerometerENT(msg.get(0).floatValue(), msg.get(1).floatValue(),
					msg.get(2).floatValue());
			if (!ACC.equals(newACC)) {
				ACC = newACC;
				EEG.setACC_X(msg.get(0).floatValue());
				EEG.setACC_Y(msg.get(1).floatValue());
				EEG.setACC_Z(msg.get(2).floatValue());
				EEDData.put("X", Math.round(msg.get(0).floatValue()) + "");
				EEDData.put("Y", Math.round(msg.get(1).floatValue()) + "");
				EEDData.put("Z", Math.round(msg.get(2).floatValue()) + "");
				ObjectMapper mapper = new ObjectMapper();

				try {
					if (record)
						RecordData.recordMainTask(mapper.writeValueAsString(EEDData), true, "AccelerometerREC");
				} catch (JsonGenerationException e) {
					e.printStackTrace();
				} catch (JsonMappingException e) {
					e.printStackTrace();
				} catch (IOException e) {
					e.printStackTrace();
				}
			}
		}
		if (msg.checkAddrPattern("/muse/gyro") == true) {
			System.out.println(msg.get(0).floatValue());
			System.out.println(msg.get(1).floatValue());
			System.out.println(msg.get(2).floatValue());
		}
		if (msg.checkAddrPattern("/muse/elements/blink") == true) {
			if (msg.get(0).intValue() == 1) {
				EEG.setBlink(true);
			} else
				EEG.setBlink(false);
		}
		if (msg.checkAddrPattern("/muse/elements/experimental/concentration") == true) {
			EEG.setConcentration(msg.get(0).floatValue() * 100);
		}
		if (msg.checkAddrPattern("/muse/elements/experimental/mellow") == true) {
			EEG.setMeditation(msg.get(0).floatValue() * 100);
		}
		if (record) {
			EEG.setIMG("");
			EEG.setACC_X(0);
			EEG.setACC_Y(0);
			EEG.setACC_Z(0);
			try {
				ObjectMapper mapper = new ObjectMapper();
				mapper.writeValueAsString(EEG);
				RecordData.recordMainTask(mapper.writeValueAsString(EEG), true, "EEGREC");
			} catch (Exception e) {
				e.printStackTrace();
			}

		}
	}

	private Map<String, Float> recordTheBand(OscMessage msg) {
		Map<String, Float> tmp = new HashMap<String, Float>();
		tmp.put("1", msg.get(0).floatValue());
		tmp.put("2", msg.get(1).floatValue());
		tmp.put("3", msg.get(2).floatValue());
		tmp.put("4", msg.get(3).floatValue());
		tmp.put("5", getVal(msg));
		return tmp;
	}

	private float getVal(OscMessage msg) {
		float val = 0;
		int counter = 0;
		if (msg.get(0) != null && msg.get(0).floatValue() != 0) {
			val += Math.abs(msg.get(0).floatValue());
			counter++;
		}
		if (msg.get(1) != null && msg.get(1).floatValue() != 0) {
			val += Math.abs(msg.get(1).floatValue());
			counter++;
		}
		if (msg.get(2) != null && msg.get(2).floatValue() != 0) {
			val += Math.abs(msg.get(2).floatValue());
			counter++;
		}
		if (msg.get(3) != null && msg.get(3).floatValue() != 0) {
			val += Math.abs(msg.get(3).floatValue());
			counter++;
		}
		val = val / counter;
		return Float.parseFloat(val + "");
	}
}