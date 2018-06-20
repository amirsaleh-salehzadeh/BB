package app.datastream.eeg;

import java.nio.charset.Charset;
import java.nio.charset.CharsetEncoder;
import java.util.ArrayList;
import javax.websocket.Session;
import org.codehaus.jackson.map.ObjectMapper;

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
//	public static boolean stopHeadband;
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
		mapper = new ObjectMapper();
		charset = Charset.forName("UTF-8");
		encoder = charset.newEncoder();
	}

	@Override
	public void run() {
		while (killer) {
			try {
				Thread.sleep(30);
//				museOscServer.dumpResults(ExperimentType.SimpleRecord.name());
			} catch (InterruptedException e) {
				e.printStackTrace();
			}
				EEG = museOscServer.EEG;
				if (EEG != null) {
					try {
						EEG.setIMG("");
						for (Session session : GetServiceStreamSocketMediator.peers) {
							String txt = mapper.writeValueAsString(EEG);
							if (session.isOpen() && txt != null && txt.length() > 1)
								session.getAsyncRemote().sendText(txt);
						}
					} catch (Throwable e) {
						e.printStackTrace();
						continue;
					}
				}
//			}
		}
		killer = false;
		museOscServer.stopRecord();
		Thread.currentThread().interrupt();
	}

}