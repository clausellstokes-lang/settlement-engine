/**
 * @vitest-environment jsdom
 */

import { cleanup, render } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import CustomContentEditor from '../../src/components/compendium/CustomContentEditor.jsx';
import { CATEGORY_BY_KEY } from '../../src/components/compendium/customCategoryDefs.js';
import {
  getCustomContentField,
} from '../../src/domain/content/customContentManifest.js';

afterEach(cleanup);

function renderEditor(activeCat) {
  return render(
    <CustomContentEditor
      activeCat={activeCat}
      catDef={CATEGORY_BY_KEY[activeCat]}
      customContent={{}}
      definitionReady={false}
      draft={{}}
      editingId={null}
      forgeManualSample={vi.fn()}
      handleSave={vi.fn()}
      manualInterpretation={null}
      manualSample={null}
      manualSampleBusy={false}
      manualSampleCurrent={false}
      manualSampleError={null}
      resetDraft={vi.fn()}
      saveBusy={false}
      setDraft={vi.fn()}
      setShowAdvanced={vi.fn()}
      showAdvanced={false}
    />,
  );
}

function optionValues(container, field) {
  return [...container.querySelector(`#ccm-field-${field}`).options]
    .map(option => option.value)
    .filter(Boolean);
}

describe('manual custom-content editor manifest controls', () => {
  it('labels untouched controls by their registered field authority', () => {
    const { container } = renderEditor('institutions');

    expect(container.querySelector('#ccm-field-label-name')?.textContent)
      .toBe('namePresentation');
    expect(container.querySelector('#ccm-field-label-category')?.textContent)
      .toBe('categoryPresentation');
    expect(container.querySelector('#ccm-field-label-description')?.textContent)
      .toBe('descriptionPresentation');
  });

  it('takes deity values and bounds from the canonical field contracts', () => {
    const { container } = renderEditor('deities');

    for (const field of ['alignmentAxis', 'lawAxis', 'rankAxis']) {
      expect(optionValues(container, field)).toEqual(
        getCustomContentField('deities', field).values,
      );
    }
    expect(container.querySelector('#ccm-field-portfolio').maxLength).toBe(
      getCustomContentField('deities', 'portfolio').maxLength,
    );
    expect(container.querySelector('#ccm-field-temperamentAxis')).toBeNull();
  });

  it('takes tradition motif choices from the same contracts', () => {
    const { container } = renderEditor('traditions');

    for (const field of ['motifElement', 'motifAct']) {
      expect(optionValues(container, field)).toEqual(
        getCustomContentField('traditions', field).values,
      );
    }
    expect(container.querySelector('#ccm-field-epithet').maxLength).toBe(
      getCustomContentField('traditions', 'epithet').maxLength,
    );
  });
});
