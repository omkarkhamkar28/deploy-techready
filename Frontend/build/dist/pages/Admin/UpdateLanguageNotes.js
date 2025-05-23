import * as __SNOWPACK_ENV__ from '../../../_snowpack/env.js';

import React, {useState, useEffect} from "react";
import toast from "react-hot-toast";
import axios from "axios";
import {useNavigate, useParams} from "react-router-dom";
import Layout from "../../Components/Layout/Layout.js";
import AdminMenu from "../../Components/Layout/AdminMenu.js";
import "../../Styles/FormStyle.css";
const UpdateLanguageNotes = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [languageName, setLanguageName] = useState("");
  const [mainImage, setMainImage] = useState("");
  const [notestitle, setNotesTitle] = useState("");
  const [subtitles, setSubtitles] = useState([{subtitle: "", description: "", image: null}]);
  const [loading, setLoading] = useState(false);
  const getSingleLanguage = async () => {
    try {
      const {data} = await axios.get(`${__SNOWPACK_ENV__.SNOWPACK_PUBLIC_API}/language/get-single-language/${params.lang}`);
      setLanguageName(data.language.languageName);
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong in getting the language");
    }
  };
  useEffect(() => {
    getSingleLanguage();
  }, []);
  const getSingleNotes = async () => {
    try {
      const {data} = await axios.get(`${__SNOWPACK_ENV__.SNOWPACK_PUBLIC_API}/language-notes/get-single-notes/${params.notes}`);
      setNotesTitle(data.note.notestitle);
      const formattedSubtitles = data.note.subtitle.map((sub, index) => ({
        subtitle: sub,
        description: data.note.description[index] || "",
        image: null
      }));
      setSubtitles(formattedSubtitles);
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong in getting the notes");
    }
  };
  useEffect(() => {
    getSingleNotes();
  }, []);
  const handleMainImageChange = (e) => {
    setMainImage(e.target.files[0]);
  };
  const handleSubtitleChange = (index, field, value) => {
    const newSubtitles = [...subtitles];
    newSubtitles[index][field] = value;
    setSubtitles(newSubtitles);
  };
  const handleAddSubtitle = () => {
    setSubtitles([...subtitles, {subtitle: "", description: "", image: null}]);
  };
  const handleRemoveSubtitle = () => {
    if (subtitles.length > 1) {
      setSubtitles(subtitles.slice(0, -1));
    } else {
      toast.error("At least one subtitle is required");
    }
  };
  const handleSubtitleImageChange = (index, file) => {
    const newSubtitles = [...subtitles];
    newSubtitles[index].image = file;
    setSubtitles(newSubtitles);
  };
  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("notestitle", notestitle);
      if (mainImage) {
        formData.append("mainImage", mainImage);
      }
      subtitles.forEach((sub, index) => {
        formData.append(`subtitle[${index}]`, sub.subtitle);
        formData.append(`description[${index}]`, sub.description);
        if (sub.image) {
          formData.append(`subImages`, sub.image);
        }
      });
      const {data} = await axios.put(`${__SNOWPACK_ENV__.SNOWPACK_PUBLIC_API}/language-notes/update-languageNotes/${params.lang}/${params.notes}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
      if (data?.success) {
        toast.success("Notes Updated Successfully");
        navigate(`/dashboard/admin/get-language/${params.lang}`);
      } else {
        toast.error(data?.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
    setLoading(false);
  };
  return /* @__PURE__ */ React.createElement(Layout, {
    title: "Dashboard - Update Notes"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "container-fluid pt-3"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "row mt-3"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "col-lg-4 col-md-3 mb-3"
  }, /* @__PURE__ */ React.createElement(AdminMenu, null)), /* @__PURE__ */ React.createElement("div", {
    className: "col-lg-8 col-md-9 mb-3"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "admin-form-container"
  }, /* @__PURE__ */ React.createElement("form", {
    onSubmit: handleUpdate
  }, /* @__PURE__ */ React.createElement("h1", null, "Update Notes"), /* @__PURE__ */ React.createElement("div", {
    className: "mb-3"
  }, /* @__PURE__ */ React.createElement("label", null, "Language Name"), /* @__PURE__ */ React.createElement("input", {
    value: languageName,
    className: "form-control",
    readOnly: true
  })), /* @__PURE__ */ React.createElement("div", {
    className: "mb-3"
  }, /* @__PURE__ */ React.createElement("label", null, "Notes Title"), /* @__PURE__ */ React.createElement("input", {
    value: notestitle,
    placeholder: "Enter Notes Title",
    className: "form-control",
    onChange: (e) => setNotesTitle(e.target.value)
  })), /* @__PURE__ */ React.createElement("div", {
    className: "mb-3"
  }, /* @__PURE__ */ React.createElement("label", {
    htmlFor: "mainImage",
    className: "form-label"
  }, "Main Image:"), mainImage && /* @__PURE__ */ React.createElement("img", {
    src: `${__SNOWPACK_ENV__.SNOWPACK_PUBLIC_API}/${mainImage}`,
    alt: "Main",
    className: "img-thumbnail mb-2",
    style: {width: "200px"}
  }), /* @__PURE__ */ React.createElement("input", {
    type: "file",
    id: "mainImage",
    className: "form-control",
    onChange: handleMainImageChange
  })), subtitles.map((sub, index) => /* @__PURE__ */ React.createElement("div", {
    key: index
  }, /* @__PURE__ */ React.createElement("div", {
    className: "mb-3"
  }, /* @__PURE__ */ React.createElement("label", null, "Subtitle ", index + 1), /* @__PURE__ */ React.createElement("input", {
    value: sub.subtitle,
    placeholder: "Enter Subtitle",
    className: "form-control",
    onChange: (e) => handleSubtitleChange(index, "subtitle", e.target.value)
  })), /* @__PURE__ */ React.createElement("div", {
    className: "mb-3"
  }, /* @__PURE__ */ React.createElement("label", null, "Description"), /* @__PURE__ */ React.createElement("textarea", {
    value: sub.description,
    placeholder: "Enter Description",
    className: "form-control",
    onChange: (e) => handleSubtitleChange(index, "description", e.target.value)
  })))), /* @__PURE__ */ React.createElement("div", {
    className: "mb-3 text-center"
  }, /* @__PURE__ */ React.createElement("button", {
    type: "button",
    className: "btn btn-success w-25 me-2",
    onClick: handleAddSubtitle
  }, "Add Subtitle"), /* @__PURE__ */ React.createElement("button", {
    type: "button",
    className: "btn btn-danger w-25",
    onClick: handleRemoveSubtitle,
    disabled: subtitles.length <= 1
  }, "Remove Subtitle")), /* @__PURE__ */ React.createElement("div", {
    className: "mb-3 text-center"
  }, /* @__PURE__ */ React.createElement("button", {
    className: "btn btn-primary w-50",
    type: "submit",
    disabled: loading
  }, loading ? "Updating..." : "Update Notes"))))))));
};
export default UpdateLanguageNotes;
