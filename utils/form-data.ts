export const useMyFormData = () => useState<MyFormData>('form-data', () => ({}))

// Define types for form data
export interface MyFormData {
    [key: string]: string
}
