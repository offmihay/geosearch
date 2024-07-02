declare module "@formfacade/embed-react" {
  interface FormfacadeEmbedProps {
    formFacadeURL: string;
    onSubmitForm?: () => void;
    prefillForm?: () => { items: Record<string, string> };
  }

  const FormfacadeEmbed: React.FC<FormfacadeEmbedProps>;
  export default FormfacadeEmbed;
}
