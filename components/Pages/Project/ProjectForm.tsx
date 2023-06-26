import { useState } from "react";
import { useRouter } from "next/router";

import FormInput from "../../Form/FormInput";
import Button from "../../Form/Button";
import Spin from "../../Loaders/Spin";
import { useAppDispatch, useAppSelector } from "../../../fetchConfig/store";
import { SelectProject } from "../../../features/project/projectSlice";
import { AddAlertMessage } from "../../../features/UI/UISlice";
import {
  CreateProject,
  UpdateProject,
} from "../../../features/project/projectApi";

const ProjectForm: React.FC<{ title: string; projectToEdit?: any }> = ({
  title,
  projectToEdit,
}) => {
  const dispatch = useAppDispatch();
  const { projectLoading } = useAppSelector(SelectProject);
  const { push, query } = useRouter();
  const [Values, setValues] = useState({
    title: projectToEdit?.title || "",
    description: projectToEdit?.description || "",
    isTeam: projectToEdit?.isTeam || "false",
    githubLink: projectToEdit?.githubLink || "",
  });

  const handleChange = (e: any) => {
    setValues({ ...Values, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e: any) => {
    e.preventDefault();

    if (!Values.isTeam)
      return dispatch(
        AddAlertMessage({
          type: "fail",
          message: "Choose if is an individual or collaborative project",
        })
      );

    if (!projectToEdit?._id) {
      dispatch(CreateProject(Values)).then((data: any) => {
        if (data.meta.requestStatus === "fulfilled") {
          push("/project/" + data.payload.slug);
        }
      });
    } else {
      dispatch(UpdateProject({ ...Values, slug: query.slug })).then(
        (data: any) => {
          if (data.meta.requestStatus === "fulfilled") {
            push("/project/" + data.payload.slug);
          }
        }
      );
    }
  };
  return (
    <div style={{ marginBottom: "3rem" }}>
      <h2 className="text-center">{title}</h2>
      <form onSubmit={onSubmit}>
        <FormInput
          name="title"
          placeholder="Project Title"
          label="Project Title"
          onChange={handleChange}
          value={Values.title}
          required
          pattern="^.{5,100}$"
          border
          errorText="Title must be 5 - 100 characters long."
        />
        <FormInput
          type="textarea"
          name="description"
          placeholder="Project Description"
          onChange={handleChange}
          value={Values.description}
          charsLeft={2000}
          required
          pattern="^.{100,2000}$"
          border
          errorText="Description must be 100 - 2000 characters long."
        />
        <FormInput
          type="select"
          options={[
            { caption: "Collaborative", value: true },
            { caption: "Individual", value: false },
          ]}
          name="isTeam"
          defaultValue="Collaborative or Individual"
          label="Collaborative or Individual"
          onChange={handleChange}
          value={Values.isTeam}
          errorText="Please pick an option"
          required
          border
        />

        <FormInput
          name="githubLink"
          placeholder="Github Link"
          label="Github Link"
          errorText="Github link should have 20 - 1000 characters"
          onChange={handleChange}
          pattern="^.{20,1000}$"
          value={Values.githubLink}
          required
          border
          type="url"
        />

        <div className="flex-center">
          {projectLoading === "default" ? (
            <Spin />
          ) : (
            <Button
              text={!projectToEdit ? "Submit" : "Edit"}
              mode="pry"
              type="submit"
            />
          )}
        </div>
      </form>
    </div>
  );
};

export default ProjectForm;
