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

public class MuseOscServer2 {
	public static MuseSignalEntity EEG;
	public static AccelerometerENT ACC;
	public static OscP5 museServer;
	public static boolean record;
	private static HashMap<String, String> EEDData;
	// private static HashMap<String, Object> bandSessionData;
	// private static HashMap<String, Object> bandAbsData;
	// private static HashMap<String, Object> bandRelativeData;

	void oscEvent(OscMessage msg) {
		if (EEG == null) {
			EEG = new MuseSignalEntity();
			ACC = new AccelerometerENT();
			EEDData = new HashMap<>();
		}
		HashMap<String, Float> FFTTMP = null;
		HashMap<String, Float> EEGTMP = null;
		HashMap<String, Float> tmp = null;
		try {

			if (msg.checkAddrPattern("/muse/elements/raw_fft0") && record) {
				if (record) {
					FFTTMP = new HashMap<String, Float>();
					for (int i = 0; i < 129; i++) {
						FFTTMP.put(i + "", msg.get(i).floatValue());
					}
					Gson g = new Gson();
					RecordData.recordMainTask(g.toJson(FFTTMP), true, "FFT");
				}

			}
			if (msg.checkAddrPattern("/muse/elements/raw_fft1") && record) {
				if (record) {
					FFTTMP = new HashMap<String, Float>();
					for (int i = 0; i < 129; i++) {
						FFTTMP.put(i + "", msg.get(i).floatValue());
					}
					Gson g = new Gson();
					RecordData.recordMainTask(g.toJson(FFTTMP), true, "FFT");
				}
			}
			if (msg.checkAddrPattern("/muse/elements/raw_fft2") && record) {
				if (record) {
					FFTTMP = new HashMap<String, Float>();
					for (int i = 0; i < 129; i++) {
						FFTTMP.put(i + "", msg.get(i).floatValue());
					}
					Gson g = new Gson();
					RecordData.recordMainTask(g.toJson(FFTTMP), true, "FFT");
				}
			}
			if (msg.checkAddrPattern("/muse/elements/raw_fft3") && record) {
				if (record) {
					FFTTMP = new HashMap<String, Float>();
					for (int i = 0; i < 129; i++) {
						FFTTMP.put(i + "", msg.get(i).floatValue());
					}
					Gson g = new Gson();
					RecordData.recordMainTask(g.toJson(FFTTMP), true, "FFT");
				}
			}
			if (msg.checkAddrPattern("/muse/eeg") == true) {
				if (record) {
					EEGTMP = new HashMap<String, Float>();
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
					recordTheBand(msg, "LAbs");
				}
			}
			if (msg.checkAddrPattern("/muse/elements/delta_absolute") == true) {
				EEG.setDeltaABS(getVal(msg));
				if (record)
					recordTheBand(msg, "DAbs");
			}
			if (msg.checkAddrPattern("/muse/elements/theta_absolute") == true) {
				EEG.setTetaABS(getVal(msg));
				if (record)
					recordTheBand(msg, "TAbs");
			}
			if (msg.checkAddrPattern("/muse/elements/alpha_absolute") == true) {
				EEG.setAlphaABS(getVal(msg));
				if (record)
					recordTheBand(msg, "AAbs");
			}
			if (msg.checkAddrPattern("/muse/elements/beta_absolute") == true) {
				EEG.setBetaABS(getVal(msg));
				if (record)
					recordTheBand(msg, "BAbs");
			}
			if (msg.checkAddrPattern("/muse/elements/gamma_absolute") == true) {
				EEG.setGammaABS(getVal(msg));
				if (record)
					recordTheBand(msg, "GAbs");
			}
			if (msg.checkAddrPattern("/muse/elements/low_freqs_relative") == true) {
				EEG.setLowFreqR(getVal(msg));
				if (record)
					recordTheBand(msg, "LRel");

			}
			if (msg.checkAddrPattern("/muse/elements/delta_relative") == true) {
				if (record)
					recordTheBand(msg, "DRel");
			}
			if (msg.checkAddrPattern("/muse/elements/theta_relative") == true) {
				EEG.setTetaR(getVal(msg));
				if (record)
					recordTheBand(msg, "TRel");
			}
			if (msg.checkAddrPattern("/muse/elements/alpha_relative") == true) {
				EEG.setAlphaR(getVal(msg));
				if (record)
					recordTheBand(msg, "ARel");
			}
			if (msg.checkAddrPattern("/muse/elements/beta_relative") == true) {
				EEG.setBetaR(getVal(msg));
				if (record)
					recordTheBand(msg, "BRel");
			}
			if (msg.checkAddrPattern("/muse/elements/gamma_relative") == true) {
				EEG.setGammaR(getVal(msg));
				if (record)
					recordTheBand(msg, "GRel");
			}
			if (msg.checkAddrPattern("/muse/elements/delta_session_score") == true) {
				EEG.set_delta(getVal(msg));
				if (record)
					recordTheBand(msg, "DSess");
			}
			if (msg.checkAddrPattern("/muse/elements/theta_session_score") == true) {
				EEG.set_teta(getVal(msg));
				if (record)
					recordTheBand(msg, "TSess");
			}
			if (msg.checkAddrPattern("/muse/elements/alpha_session_score") == true) {
				EEG.set_alpha(getVal(msg));
				if (record)
					recordTheBand(msg, "ASess");
			}
			if (msg.checkAddrPattern("/muse/elements/beta_session_score") == true) {
				EEG.set_beta(getVal(msg));
				if (record)
					recordTheBand(msg, "BSess");
			}
			if (msg.checkAddrPattern("/muse/elements/gamma_session_score") == true) {
				EEG.set_gamma(getVal(msg));
				if (record)
					recordTheBand(msg, "GSess");
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
					if (record)
						RecordData.recordMainTask("1", true, "blinkRec");
				} else
					EEG.setBlink(false);
			}
			if (msg.checkAddrPattern("/muse/elements/experimental/concentration") == true) {
				EEG.setConcentration(msg.get(0).floatValue() * 100);
			}
			if (msg.checkAddrPattern("/muse/elements/experimental/mellow") == true) {
				EEG.setMeditation(msg.get(0).floatValue() * 100);
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	private void recordTheBand(OscMessage msg, String fileName) {
		Map<String, Float> tmpZ = new HashMap<String, Float>();
		if (msg.get(0) != null && msg.get(0).floatValue() != 0 && !Float.isNaN(msg.get(0).floatValue()))
			tmpZ.put("1", msg.get(0).floatValue());
		if (msg.get(1) != null && msg.get(1).floatValue() != 0 && !Float.isNaN(msg.get(1).floatValue()))
			tmpZ.put("2", msg.get(1).floatValue());
		if (msg.get(2) != null && msg.get(2).floatValue() != 0 && !Float.isNaN(msg.get(2).floatValue()))
			tmpZ.put("3", msg.get(2).floatValue());
		if (msg.get(3) != null && msg.get(3).floatValue() != 0 && !Float.isNaN(msg.get(3).floatValue()))
			tmpZ.put("4", msg.get(3).floatValue());
		tmpZ.put("5", getVal(msg));
		Gson g = new Gson();
		RecordData.recordMainTask(g.toJson(tmpZ), true, fileName);
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