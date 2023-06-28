export const urlRegex =
  "^(https?://)?(www\\.)?([-a-z0-9]{1,63}\\.)*?[a-z0-9][-a-z0-9]{0,61}[a-z0-9]\\.[a-z]{2,6}(/[-\\w@\\+\\.~#\\?&/=%]*)?$";

export const BlogFormInputsArray = [
  {
    name: "title",
    label: "Blog Title",
    placeholder: "Blog Title",
    required: true,
    focused: false,
    pattern: "^.{5,100}$",
    errorText: "Blog title should be 5 - 100 characters.",
  },
  {
    name: "estimatedReadTime",
    label: "Estimated Read Time",
    placeholder: "Estimated Read Time",
    required: true,
    focused: false,
    type: "number",
    errorText: "Invalid estimated read time",
  },
  {
    name: "intro",
    type: "textarea",
    charsLeft: 200,
    label: "Introduction",
    placeholder: "Introduction",
    required: true,
    pattern: "^.{100,200}$",
    errorText: "Intro should be 100 - 200 characters",
  },
];
