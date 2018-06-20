package app.common.utils;


import java.io.File;
import java.nio.file.Path;
import java.nio.file.Paths;

import app.common.EEG.EegData;

/**
 * @author Shiran Schwartz on 20/08/2016.
 */
public class FileUtils {
    public static final String NEW_LINE = "\n";
    public static final String CSV_SEPARSATOR = ",";
//    private static SimpleDateFormat FILE_FORMAT_NAME = new SimpleDateFormat("yy-MM-dd_HH-mm");

//    private static String TIMESTAMP_FOLDER = FILE_FORMAT_NAME.format(new Date());
    private static String BASE_PATH = "C:\\RecordingFiles\\";
    private static volatile String path;

    private static void init() {
        if (path == null) {
            synchronized (FileUtils.class) {
                if (path == null) {
                    path = BASE_PATH;
                    boolean created = new File(path).mkdir();
                    if (!created) {
                        System.out.println("could not create a new dir:" + path);
                    }
                }
            }
        }
    }

    public static String getPath() {
        init();
        return BASE_PATH;
    }

    public static Path resolve(String eegData) {
        init();
        return Paths.get(BASE_PATH).resolve(eegData);
    }

    public static String formatCsvLine(EegData eegData) {
        StringBuilder builder = new StringBuilder();
//        builder.append(TimeUtils.getNtpTimeString(eegData.getTimeTagNtp())); // real timetag
//        builder.append(CSV_SEPARSATOR);
//        builder.append(TimeUtils.format(eegData.getServerTimeTag()));  // server timetag
//        builder.append(CSV_SEPARSATOR);
//        builder.append(eegData.getServerTimeTag()); // raw timetag
//        builder.append(CSV_SEPARSATOR);
        builder.append(eegData.getServerTimeTag());// raw server time
        builder.append(CSV_SEPARSATOR);
//        builder.append(eegData.getType());// type
//        builder.append(CSV_SEPARSATOR);
        for (Object str: eegData.getArguments()) {
//        	if(Float.isNaN((float) str))
//        		str = 0.0;
            builder.append(str); // data
            builder.append(CSV_SEPARSATOR);
        }
        return builder.toString();
    }
}
