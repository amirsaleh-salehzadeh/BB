import csv

my_list = []


class labelENT:
    mw = 0.0
    activity = 0.0
    mood = 0.0
    dr = 0.0
    time = 0

    def __init__(self, t, MW, Mood, distReason):
        self.time = t
        self.mood = Mood
        self.dr = distReason
        self.mw = MW


with open('C:\\RecordingFiles\\0_LabelsREC.csv', 'r') as f:
    reader = csv.reader(f)
    for row in reader:
        my_list.append(labelENT(row[0], row[1], row[2], row[3]))
        print(row[0])
        

print(my_list.__len__())
