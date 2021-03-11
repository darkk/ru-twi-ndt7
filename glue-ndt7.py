#!/usr/bin/env python3

import json
import itertools
import dateutil.parser

def mkiter(fname):
    with open(fname) as fd:
        for line in fd:
            line = json.loads(line)
            line['Start'] = dateutil.parser.parse(line['Meta']['StartTime']).timestamp()
            line['End'] = dateutil.parser.parse(line['Meta']['EndTime']).timestamp()
            yield line

def main():
    it1, it2 = itertools.tee(mkiter('ndt7-meta'), 2)
    next(it2)
    for l1, l2 in zip(it1, it2):
        m1, m2 = l1['Meta'], l2['Meta']
        # print(l1)
        if m1['ClientIP'] != m2['ClientIP'] or m1['ServerIP'] != m2['ServerIP']: # or abs(l2['Start'] - l1['End']) > 5.0:
            continue
        if l1['Mbit'] < 0.25 and l2['Mbit'] > 1.5:
            print('{} {} {} {} {} {}'. format(m1['UUID'], m2['UUID'], l1['Meta']['StartTime'], m1['ClientIP'], l1['Mbit'], l2['Mbit']))


if __name__ == '__main__':
    main()
