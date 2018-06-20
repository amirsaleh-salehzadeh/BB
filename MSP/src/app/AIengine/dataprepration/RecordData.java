package app.AIengine.dataprepration;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.Set;
import java.util.TreeMap;

import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.codehaus.jackson.JsonGenerationException;
import org.codehaus.jackson.JsonParseException;
import org.codehaus.jackson.map.JsonMappingException;
import org.codehaus.jackson.map.ObjectMapper;
import org.jblas.DoubleMatrix;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

import app.common.utils.FileUtils;

public class RecordData {
	public static int outTimer = 0;

	public static void main(String[] arString) {
		prepareObjects("C:\\RecordingFiles\\1");
		// labelTheRows(null, 3559316);
	}

	public static void recordMainTask(String value, boolean append, String fileName) {
		value = value.replaceAll("\\]", "");
		value = value.replaceAll("\\[", "");
		ArrayList<String> StringEMGCollector = new ArrayList<String>();
		StringEMGCollector.add(value);
		ExcelDataStorage ds = new ExcelDataStorage();
		ds.insertDataToTheFile(StringEMGCollector, append, fileName);

	}

	private static TreeMap<Integer, Object> mapLabels;
	private static Map<String, TreeMap<Integer, Object>> allItems;

	private static void convertFileToObj(String line, String fileName) {
		String[] vals = line.split(",");
		if (vals.length <= 1)
			return;
		if (!fileName.contains("0_")) {
			line = line.replaceAll("\n", "");
			line += labelTheRows(Integer.parseInt((vals[0]).substring(vals[0].length() - 7, vals[0].length())));
		}
		if (fileName.contains("0_")) {
			mapLabels.put(Integer.parseInt(vals[0]), line);
		} else {
			try {
				File f = new File("C:\\RecordingFiles\\3\\labeled.csv");
				boolean newFile = false;
				if (!f.exists()) {
					f.createNewFile();
					newFile = true;
				}
				FileWriter writer = new FileWriter("C:\\RecordingFiles\\3\\labeled.csv", true);
				if (newFile) {
					String header = "time,x,y,z,label";
					writer.write(header);
					writer.write("\n");
				}
				System.out.println(line);
				writer.append(line);
				writer.append("\n");
				writer.flush();
				writer.close();
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
	}

	private static String labelTheRows(int time) {
		Map.Entry<Integer, Object> low = mapLabels.floorEntry(time);
		Map.Entry<Integer, Object> high = mapLabels.ceilingEntry(time);
		Object closest = null;
		int closestTime = -1;
		if (low != null && high != null) {
			closest = Math.abs(time - low.getKey()) < Math.abs(time - high.getKey()) ? low.getValue() : high.getValue();
			closestTime = Math.abs(time - low.getKey()) < Math.abs(time - high.getKey()) ? low.getKey() : high.getKey();
		} else if (low != null || high != null) {
			closest = low != null ? low.getValue() : high.getValue();
			closestTime = low != null ? low.getKey() : high.getKey();
		}
		if (Math.abs(time - closestTime) > 1000)
			return null;
		return (String) closest.toString().split(",")[2];
	}

	public static void prepareObjects(String rootFolder) {
		File dir = new File(rootFolder);
		File[] files = dir.listFiles();
		for (int i = 0; i < files.length; i++) {
			BufferedReader inputStream = null;
			if (files[i].getName().contains("labeled"))
				continue;
			try {
				inputStream = new BufferedReader(new FileReader(files[i]));
			} catch (FileNotFoundException e1) {
				e1.printStackTrace();
			}
			String line;
			try {
				if (mapLabels == null)
					mapLabels = new TreeMap<Integer, Object>();
				if (allItems == null)
					allItems = new HashMap<String, TreeMap<Integer, Object>>();
				int lineCnt = 0;
				while ((line = inputStream.readLine()) != null) {
					if (line.length() <= 5)
						continue;
					if (lineCnt > 0)
						convertFileToObj(line, files[i].getName());
					lineCnt++;
				}
//				ExcelDataStorage.generateReport();
				System.out.println("hey");
				inputStream.close();
			} catch (JsonGenerationException e) {
				e.printStackTrace();
			} catch (JsonMappingException e) {
				e.printStackTrace();
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
	}

}
