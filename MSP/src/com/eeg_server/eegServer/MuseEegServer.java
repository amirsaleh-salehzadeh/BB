package com.eeg_server.eegServer;

import com.eeg_server.experiment.oddball.FileUtils;
import com.eeg_server.experiment.oddball.OddBallExperiment;
import com.eeg_server.oscP5.OscMessage;
import com.eeg_server.oscP5.OscP5;
import com.eeg_server.oscP5.OscProperties;
import com.google.common.collect.Lists;
import com.google.common.collect.Sets;

import app.AIengine.dataprepration.RecordData;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.Set;

import static com.eeg_server.experiment.oddball.FileUtils.NEW_LINE;

//TODO: parse 	/muse/eeg/quantization,
/**
 * @author shiran on 20/08/2016.
 */
public class MuseEegServer implements EegServer {

	private static final String HEADER = "Timetag Ntp,Server Timestamp,Raw Timetag, Raw Server Timestamp,Data Type,data";
	private static OscP5 oscP5;
	private List<EegData> messages = Lists.newLinkedList();

	public static void main(String args[]) throws InterruptedException {
		new MuseEegServer().startRecord();
	}

	@Override
	public void startRecord() {
		oscP5 = new OscP5(this, "localhost", 5003, OscProperties.UDP);
	}

	public String convertTime(long time) {
		Date date = new Date(time);
		SimpleDateFormat format = new SimpleDateFormat("dd HH:mm:ss.SSS Z");
		return format.format(date);
	}

	Set<String> others = Sets.newHashSet();

	void oscEvent(OscMessage msg) {
		String name = msg.addrPattern();
		Type type = Type.getValue(name);

		String msgToAdd = null;
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
			System.out.println("signal quality:" + MuseSignals.asString(msg, Type.HORSE_SHOE));
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

	@Override
	public void stopRecord() {
		oscP5.dispose();
	}

	@Override
	public void close() {

	}

	@Override
	public int getEventsSize() {
		return messages.size();
	}

	@Override
	public void dumpResults(String filename) {
		String fileName = FileUtils.resolve(filename + ".csv").toString();
		try {
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
			for (EegData eegData : messages) {
				writer.append(FileUtils.formatCsvLine(eegData));
				writer.append(NEW_LINE);
			}
			writer.flush();
			writer.close();
			messages = new ArrayList<EegData>();
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	// how to process brain waves:
	// https://github.com/shevek/dblx/blob/4734d4617bc042895a28b14d26fc53fd780a9018/dblx-iface-muse/src/main/java/org/anarres/dblx/iface/muse/net/MuseConnect.java
	/**
	 * // NTP representation String asBitsString = String.format("%032d", new
	 * BigInteger(Long.toBinaryString((long) timetag))); String first32 =
	 * asBitsString.substring(0,32); long secondsSince1900 = new BigInteger(first32,
	 * 2).longValue(); String last32 = asBitsString.substring(33); long
	 * microsecondsSince1900 = new BigInteger(first32, 2).longValue(); long ntp =
	 * secondsSince1900 + microsecondsSince1900; //(70*365 + 17)*86400 = 2208988800
	 * long unitNtpDelta = (long) (70 * 365 + 17) * 86400; long secondsAsMs =
	 * secondsSince1900*1000; long microSecondsAsMs = microsecondsSince1900/1000;
	 * long NtpMs =secondsAsMs + microSecondsAsMs; long s = secondsAsMs
	 */

}
