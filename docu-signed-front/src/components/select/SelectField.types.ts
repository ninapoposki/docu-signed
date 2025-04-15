export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectFieldProps {
  name: string;
  value: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  options: SelectOption[];
  required?: boolean;
  placeholder?: string;
  className?: string;
}
