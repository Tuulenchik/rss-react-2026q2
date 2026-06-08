import { useState } from 'react';

import Modal from '../Modal/Modal';

import './FormsSection.css';

type ActiveForm = 'uncontrolled' | 'react-hook-form';

const FORM_TITLES: Record<ActiveForm, string> = {
  uncontrolled: 'Uncontrolled form',
  'react-hook-form': 'React Hook Form',
};

export default function FormsSection() {
  const [activeForm, setActiveForm] = useState<ActiveForm | null>(null);

  const isModalOpen = activeForm !== null;

  function handleCloseModal() {
    setActiveForm(null);
  }

  function renderModalContent() {
    if (activeForm === 'uncontrolled') {
      return (
        <div className="form-placeholder" data-testid="uncontrolled-form-placeholder">
          Uncontrolled form will be implemented here.
        </div>
      );
    }

    if (activeForm === 'react-hook-form') {
      return (
        <div className="form-placeholder" data-testid="react-hook-form-placeholder">
          React Hook Form implementation will be implemented here.
        </div>
      );
    }

    return null;
  }

  return (
    <section className="forms-section" aria-labelledby="forms-title">
      <h1 id="forms-title">Forms</h1>

      <div className="forms-actions">
        <button
          className="app-button"
          type="button"
          onClick={() => setActiveForm('uncontrolled')}
        >
          Open uncontrolled form
        </button>

        <button
          className="app-button"
          type="button"
          onClick={() => setActiveForm('react-hook-form')}
        >
          Open React Hook Form
        </button>
      </div>

      <Modal
        isOpen={isModalOpen}
        title={activeForm ? FORM_TITLES[activeForm] : 'Form'}
        onClose={handleCloseModal}
      >
        {renderModalContent()}
      </Modal>
    </section>
  );
}