import { useEffect } from "react";

type PageMetaProps = {
  title: string;
  description: string;
  keywords?: string[];
};

export default function PageMeta(props: PageMetaProps) {
  useEffect(() => {
    document.title = props.title;
    const descriptionTag = document.querySelector('meta[name="description"]');
    if (descriptionTag) {
      descriptionTag.setAttribute("content", props.description);
    } else {
      const newTag = document.createElement("meta");
      newTag.setAttribute("name", "description");
      newTag.setAttribute("content", props.description);
      document.head.appendChild(newTag);
    }
    if (props.keywords) {
      const keywordsTag = document.querySelector('meta[name="keywords"]');
      if (keywordsTag) {
        keywordsTag.setAttribute("content", props.keywords.join(", "));
      } else {
        const newTag = document.createElement("meta");
        newTag.setAttribute("name", "keywords");
        newTag.setAttribute("content", props.keywords.join(", "));
        document.head.appendChild(newTag);
      }
    }
  }, []);

  return null;
}
