package app.datastream.eeg;

import java.nio.charset.Charset;
import java.nio.charset.CharsetEncoder;
import java.util.ArrayList;
import javax.websocket.Session;
import org.codehaus.jackson.map.ObjectMapper;

import com.eeg_server.experiment.ExperimentType;
import com.eeg_server.oscP5.OscProperties;

import app.AIengine.dataprepration.DataPreparationAccell;
import app.common.MuseSignalEntity;
import app.webservices.GetServiceStreamSocketMediator;
import netP5.NetAddress;
import oscP5.OscP5;

public class ThreadEEGReceiver implements Runnable {

	public static volatile boolean killer;
	public static MuseOscServer museOscServer;
	public static MuseSignalEntity EEG;
	public static OscP5 museServer;
	public static boolean stopHeadband;
	// private GetServiceStreamSocketMediator socketMSG;
	private ObjectMapper mapper;
	public static Charset charset;// = Charset.forName("UTF-8");
	public static CharsetEncoder encoder; // = charset.newEncoder();

	public ThreadEEGReceiver() {
		// muse-io.exe --device Muse-1E5B
		// muse-io.exe --osc osc.tcp://localhost:4444
		// muse-io --device Muse-1E5B --osc osc.udp://localhost:5003
		museOscServer = new MuseOscServer();
		museOscServer.startRecord();
//		museOscServer.museServer = new OscP5(this, "localhost", 5003, OscProperties.UDP);
		stopHeadband = false;
		// socketMSG = new GetServiceStreamSocketMediator();
		mapper = new ObjectMapper();
		charset = Charset.forName("UTF-8");
		encoder = charset.newEncoder();
	}

	@Override
	public void run() {
		while (killer) {
			try {
				Thread.sleep(30);
				museOscServer.dumpResults(ExperimentType.SimpleRecord.name());
			} catch (InterruptedException e) {
				e.printStackTrace();
			}
			if (stopHeadband) {
				EEG = new MuseSignalEntity(0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
				museOscServer.startRecord();
				killer = false;
				Thread.currentThread().interrupt();
			} else {
//				if (museOscServer.museServer == null) {
//					museOscServer = new MuseOscServer();
//					museOscServer.museServer = new OscP5(this, "localhost", 5003, OscProperties.UDP);
//				}
				EEG = museOscServer.EEG;
				if (EEG != null) {
					try {
						EEG.setIMG("");
						for (Session session : GetServiceStreamSocketMediator.peers) {
							if (session.isOpen())
								session.getAsyncRemote().sendText(mapper.writeValueAsString(EEG));
						}
					} catch (Throwable e) {
						e.printStackTrace();
					}
				}
			}
		}
		killer = false;
		museOscServer.startRecord();
		Thread.currentThread().interrupt();
	}

}