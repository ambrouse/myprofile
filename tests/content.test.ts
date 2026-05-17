import { describe, expect, it } from 'vitest';
import en from '../src/content/profile.en.json';
import vi from '../src/content/profile.vi.json';

function keys(value: object) {
  return Object.keys(value).sort();
}

describe('localized portfolio content', () => {
  it('keeps top-level locale keys aligned', () => {
    expect(keys(en)).toEqual(keys(vi));
  });

  it('keeps selected case counts aligned', () => {
    expect(en.cases.items).toHaveLength(vi.cases.items.length);
    expect(en.capabilities.items).toHaveLength(vi.capabilities.items.length);
  });
});
