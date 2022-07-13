import { OpeningHour } from '../shared/types';
import { validateOpeningHours } from './validateOpeningHours';

describe('validateOpeningHours', () => {
  test('sanity', () => {
    expect(validateOpeningHours({})).toBeFalsy();
  });

  describe('array', () => {
    test('maximum 7 items', () => {
      const json: OpeningHour[] = [
        { open: { day: 0 }},
        { open: { day: 1 }},
        { open: { day: 2 }},
        { open: { day: 3 }},
        { open: { day: 4 }},
        { open: { day: 5 }},
        { open: { day: 6 }}
      ];
      expect(validateOpeningHours(json)).toBeTruthy();
    });
    test('unique items', () => {
      const json: OpeningHour[] = [
        { open: { day: 1 }},
        { open: { day: 1 }},
        { open: { day: 2 }},
        { open: { day: 3 }},
        { open: { day: 4 }},
        { open: { day: 5 }},
        { open: { day: 5 }}
      ];
      expect(validateOpeningHours(json)).toBeFalsy();
    });
  });

  describe('open', () => {
    describe('day', () => {
      test('time is optional', () => {
        expect(validateOpeningHours([{ open: { day: 1 }}] as OpeningHour[])).toBeTruthy();
      });

      test('accepts integer 0-6', () => {
        expect(validateOpeningHours([{ open: { day: -1 }}] as OpeningHour[])).toBeFalsy();
        expect(validateOpeningHours([{ open: { day: 7 }}] as OpeningHour[])).toBeFalsy();
        
        expect(validateOpeningHours([{ open: { day: 0 }}] as OpeningHour[])).toBeTruthy();
        expect(validateOpeningHours([{ open: { day: 1 }}] as OpeningHour[])).toBeTruthy();
        expect(validateOpeningHours([{ open: { day: 2 }}] as OpeningHour[])).toBeTruthy();
        expect(validateOpeningHours([{ open: { day: 3 }}] as OpeningHour[])).toBeTruthy();
        expect(validateOpeningHours([{ open: { day: 4 }}] as OpeningHour[])).toBeTruthy();
        expect(validateOpeningHours([{ open: { day: 5 }}] as OpeningHour[])).toBeTruthy();
        expect(validateOpeningHours([{ open: { day: 6 }}] as OpeningHour[])).toBeTruthy();
      });
    });

    describe('time', () => {
      test('accepts 24 hour string format "[hhmm]" "0000" to "2339"', () => {
        expect(validateOpeningHours([{ open: { day: 0, time: '00000' }}] as OpeningHour[])).toBeFalsy();
        expect(validateOpeningHours([{ open: { day: 0, time: '2400' }}] as OpeningHour[])).toBeFalsy();
  
        expect(validateOpeningHours([{ open: { day: 0, time: '0000' }}] as OpeningHour[])).toBeTruthy();
        expect(validateOpeningHours([{ open: { day: 0, time: '2359' }}] as OpeningHour[])).toBeTruthy();
      });
    });
  });

  describe('close', () => {
    const open: OpeningHour = { open: { day: 1 }};

    describe('day', () => {
      test('time is optional', () => {
        expect(validateOpeningHours([{ ...open, close: { day: 0 } }] as OpeningHour[])).toBeTruthy();
      });

      test('accepts integer 0-6', () => {
        expect(validateOpeningHours([{ ...open, close: { day: -1 }}] as OpeningHour[])).toBeFalsy();
        expect(validateOpeningHours([{ ...open, close: { day: 7 }}] as OpeningHour[])).toBeFalsy();
        
        expect(validateOpeningHours([{ ...open, close: { day: 0 }}] as OpeningHour[])).toBeTruthy();
        expect(validateOpeningHours([{ ...open, close: { day: 1 }}] as OpeningHour[])).toBeTruthy();
        expect(validateOpeningHours([{ ...open, close: { day: 2 }}] as OpeningHour[])).toBeTruthy();
        expect(validateOpeningHours([{ ...open, close: { day: 3 }}] as OpeningHour[])).toBeTruthy();
        expect(validateOpeningHours([{ ...open, close: { day: 4 }}] as OpeningHour[])).toBeTruthy();
        expect(validateOpeningHours([{ ...open, close: { day: 5 }}] as OpeningHour[])).toBeTruthy();
        expect(validateOpeningHours([{ ...open, close: { day: 6 }}] as OpeningHour[])).toBeTruthy();
      });
    });

    describe('time', () => {
      test('accepts 24 hour string format "[hhmm]" "0000" to "2339"', () => {
        expect(validateOpeningHours([{ ...open, close: { day: 0, time: '00000' }}] as OpeningHour[])).toBeFalsy();
        expect(validateOpeningHours([{ ...open, close: { day: 0, time: '2400' }}] as OpeningHour[])).toBeFalsy();
  
        expect(validateOpeningHours([{ ...open, close: { day: 0, time: '0000' }}] as OpeningHour[])).toBeTruthy();
        expect(validateOpeningHours([{ ...open, close: { day: 0, time: '2359' }}] as OpeningHour[])).toBeTruthy();
      });
    });
  });
});