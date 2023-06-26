import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";

interface IProps {
  children: React.ReactNode;
}

const CaptchaContainer: React.FC<IProps> = ({ children }) => {
  return (
    <GoogleReCaptchaProvider
      reCaptchaKey="6Lclic8mAAAAAKDi0xb5FKlxhzqwJULrQG5hhLIy"
      scriptProps={{
        async: false,
        defer: false,
        appendTo: "head",
        nonce: undefined,
      }}
    >
      {children}
    </GoogleReCaptchaProvider>
  );
};

export default CaptchaContainer;
