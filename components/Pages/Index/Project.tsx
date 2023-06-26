import { useEffect } from "react";
import Link from "next/link";

import { useAppDispatch, useAppSelector } from "../../../fetchConfig/store";
import { GetAllProjects } from "../../../features/project/projectApi";
import { SelectProject } from "../../../features/project/projectSlice";

import classes from "./Project.module.scss";

const Project = () => {
  const dispatch = useAppDispatch();
  const { projects } = useAppSelector(SelectProject);

  useEffect(() => {
    if (projects.length < 1) {
      dispatch(GetAllProjects());
    }
  }, [projects.length]);

  if (projects?.length > 0)
    return (
      <div className={classes.Container} id="projects">
        <h3>Projects</h3>
        <div className={classes.ProjectList}>
          {projects.map((project) => (
            <div className={classes.Project} key={project._id}>
              <h4>{project.title} </h4>
              <span className={classes.Collab}>
                {project.isTeam ? "Collaborative" : "Individual"}
              </span>
              <p className={classes.Description}>{project.description}</p>

              <div className={classes.Github}>
                <a href={project.githubLink} target="_blank" rel="noreferrer">
                  Github Repo
                </a>
                <Link
                  href={`/project/${project.slug}`}
                  className={classes.More}
                >
                  More
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  return <></>;
};

export default Project;
