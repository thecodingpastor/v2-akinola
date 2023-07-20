import Head from "next/head";
import { useEffect } from "react";
import { useRouter } from "next/router";

import Button from "../../../components/Form/Button";
import { GetServerSideProps } from "next";
import { useAppDispatch } from "../../../fetchConfig/store";
import { AddAlertMessage } from "../../../features/UI/UISlice";

import { SetCurrentProject } from "../../../features/project/projectSlice";
import { ProjectType } from "../../../features/project/type";
import Transition from "../../../components/General/Transition";

const SingleProjectPage = (project: ProjectType) => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!project._id) {
      router.push("/");
      dispatch(
        AddAlertMessage({
          type: "fail",
          message: "Could not find project. Try again later",
        })
      );
    }
    dispatch(SetCurrentProject(project));
  }, []);
  return (
    <Transition mode="slide-right">
      <Head>
        <title>{project?.title || "Project"}</title>
      </Head>
      <div
        className="container"
        style={{
          padding: "2rem",
          textAlign: "justify",
        }}
      >
        <h2 className="text-center">{project?.title}</h2>
        {project?.isTeam && (
          <div
            className="text-center"
            style={{ fontWeight: "bold", fontSize: "italic" }}
          >
            This is a collaborative project
          </div>
        )}
        <p>{project?.description}</p>
        <div className="flex-center">
          <Button
            mode="pry"
            to={`${project.githubLink}`}
            text="Go To Github Repo"
            target="__blank"
          />
        </div>
      </div>
      ;
    </Transition>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  try {
    const res = await fetch(
      process.env.NODE_ENV === "production"
        ? process.env.LIVE_SITE + "/api/project/" + params?.slug
        : "http://localhost:3000/api/project/" + params?.slug
    );
    const data = await res.json();

    return {
      props: data,
    };
  } catch (err: any) {
    return {
      props: { notFound: true },
    };
  }
};

export default SingleProjectPage;
