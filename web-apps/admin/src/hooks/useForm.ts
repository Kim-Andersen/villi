import { useState } from 'react';

type FormElementChangeFunction = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
type ResetFunction = () => void;
type OnChangeCallback<T> = (form: T) => void;

export default function useForm<T extends Record<any, any>>(initialValue: T, onChange?: OnChangeCallback<T>): [T, FormElementChangeFunction, ResetFunction] {
  const [form, setForm] = useState<T>(initialValue);

  const handleFormElementChange: FormElementChangeFunction = event => {
    const target = event.target;
    const isCheckbox = 'checked' in target;
    let value: unknown;

    if (isCheckbox) {
      if (target.name in form && Array.isArray(form[target.name])) {
        const array = form[target.name] as Array<unknown>;
        if (target.checked && !array.includes(target.value)) {
          array.push(target.value);
        } else if (array.includes(target.value)) {
          array.splice(array.indexOf(target.value), 1);
        }
        value = array;
      } else {
        value = target.value;
      }
    } else {
      value = target.value;
    }

    const newForm = { 
      ...form,  
      [target.name]: value
    };
    
    setForm(newForm);

    if (typeof onChange === 'function') {
      onChange(newForm);
    }
  };

  const reset = () => setForm(initialValue);

  return [form, handleFormElementChange, reset];
}