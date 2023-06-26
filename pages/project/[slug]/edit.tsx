import { useEffect } from "react";
import { useRouter } from "next/router";

import ProtectedRoute from "../../../components/Layout/ProtectedRoute";
import ProjectForm from "../../../components/Pages/Project/ProjectForm";
import { useAppDispatch, useAppSelector } from "../../../fetchConfig/store";
import { SelectProject } from "../../../features/project/projectSlice";
import { AddAlertMessage } from "../../../features/UI/UISlice";

const EditProject = () => {
  const { currentProject } = useAppSelector(SelectProject);
  const dispatch = useAppDispatch();
  const router = useRouter();

  useEffect(() => {
    if (!currentProject) {
      router.replace("/");
      dispatch(
        AddAlertMessage({
          message: "Could not find project. Try again later",
        })
      );
    }
  }, []);

  return (
    <ProtectedRoute>
      <div className="container">
        <ProjectForm
          title={`Edit ''${currentProject?.title}''`}
          projectToEdit={currentProject}
        />
      </div>
    </ProtectedRoute>
  );
};

export default EditProject;
