import { defineOption, defineType } from '@embeddable.com/core';
import { TimeZone } from '../enums/TimeZone';

const TimeZones = defineType('timeZones', {
  label: 'Time Zones',
  optionLabel: (tz: string) => tz,
});

defineOption(TimeZones, TimeZone.UTC);
defineOption(TimeZones, TimeZone['UTC-11']);
defineOption(TimeZones, TimeZone['UTC-10']);
defineOption(TimeZones, TimeZone['UTC-9:30']);
defineOption(TimeZones, TimeZone['UTC-9']);
defineOption(TimeZones, TimeZone['UTC-8']);
defineOption(TimeZones, TimeZone['UTC-7']);
defineOption(TimeZones, TimeZone['UTC-6']);
defineOption(TimeZones, TimeZone['UTC-5']);
defineOption(TimeZones, TimeZone['UTC-4']);
defineOption(TimeZones, TimeZone['UTC-3:30']);
defineOption(TimeZones, TimeZone['UTC-3']);
defineOption(TimeZones, TimeZone['UTC-2']);
defineOption(TimeZones, TimeZone['UTC-1']);
defineOption(TimeZones, TimeZone['UTC+0']);
defineOption(TimeZones, TimeZone['UTC+1']);
defineOption(TimeZones, TimeZone['UTC+2']);
defineOption(TimeZones, TimeZone['UTC+3']);
defineOption(TimeZones, TimeZone['UTC+3:30']);
defineOption(TimeZones, TimeZone['UTC+4']);
defineOption(TimeZones, TimeZone['UTC+4:30']);
defineOption(TimeZones, TimeZone['UTC+5']);
defineOption(TimeZones, TimeZone['UTC+5:30']);
defineOption(TimeZones, TimeZone['UTC+6']);
defineOption(TimeZones, TimeZone['UTC+6:30']);
defineOption(TimeZones, TimeZone['UTC+7']);
defineOption(TimeZones, TimeZone['UTC+8']);
defineOption(TimeZones, TimeZone['UTC+8:45']);
defineOption(TimeZones, TimeZone['UTC+9']);
defineOption(TimeZones, TimeZone['UTC+9:30']);
defineOption(TimeZones, TimeZone['UTC+10']);
defineOption(TimeZones, TimeZone['UTC+10:30']);
defineOption(TimeZones, TimeZone['UTC+11']);
defineOption(TimeZones, TimeZone['UTC+12']);
defineOption(TimeZones, TimeZone['UTC+12:45']);
defineOption(TimeZones, TimeZone['UTC+13']);
defineOption(TimeZones, TimeZone['UTC+14']);

export default TimeZones;
