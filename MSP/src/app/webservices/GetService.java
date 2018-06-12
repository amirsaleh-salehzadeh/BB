package app.webservices;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.Consumes;
import javax.ws.rs.FormParam;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Application;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.MultivaluedMap;
import com.google.gson.Gson;
import com.sun.jersey.api.representation.Form;
import app.AIengine.dataprepration.RecordData;
import app.common.MuseSignalEntity;
import app.datastream.eeg.MuseOscServer;
import app.datastream.eeg.ThreadEEGReceiver;
import oscP5.OscP5;

@Path("GetWS")
public class GetService extends Application {
	// REST/GetWS/.....
	private static ThreadEEGReceiver t;

	@POST
	@Path("/PostFaceFeatures")
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes({ MediaType.APPLICATION_FORM_URLENCODED, MediaType.TEXT_PLAIN, MediaType.APPLICATION_JSON })
	public String postFaceFeatures(Form form) {
		List<String> mwl = form.get("mindWanderingLabels");
		List<String> ffs = form.get("faceFeatures");
		if (ffs != null && ffs.size() > 0 && ffs.get(0).length() > 0)
			RecordData.recordMainTask(ffs.get(0), true, "FaceFeaturesREC");
		if (mwl != null && mwl.size() > 0 && mwl.get(0).length() > 0)
			RecordData.recordMainTask(mwl.get(0), true, "0_LabelsREC");
		return "";
	}

	static MuseOscServer museOscServer;
	public static MuseSignalEntity EEG;
	OscP5 museServer;
	@GET
	@Path("/ConnectHeadband")
	@Produces("application/json")
	public String connectHeadband() {
		if (t == null) {
			t = new ThreadEEGReceiver();
			t.killer = true;
			Thread ts = new Thread(t);
			ts.setName("EEGStream");
			ts.setDaemon(true);
			ts.start();
		}
		if (t != null) {
			t.stopHeadband = false;
		}
		String json = "";
		return json;
	}

	@GET
	@Path("/StartRecording")
	@Produces("application/json")
	public String startRecording() {
		if (t == null) {
			t = new ThreadEEGReceiver();
			Thread ts = new Thread(t);
			ts.setName("EEGStream");
			ts.setDaemon(true);
			ts.start();
		}
		museOscServer.record = true;
		return "";
	}

	@GET
	@Path("/StopHeadband")
	@Produces("application/json")
	public String stopHeadband() {
		if (t != null) {
			t.stopHeadband = true;
			t.killer = false;
		}
		museOscServer.record = false;
		museOscServer = null;
		t = null;
		String json = "[]";
		return json;
	}

}
