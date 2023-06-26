import Transition from "../../components/General/Transition";
import ProtectedRoute from "../../components/Layout/ProtectedRoute";
import CreateBlog from "../../features/blog/components/CreateBlog";

const CreateBlogPage = () => {
  return (
    <ProtectedRoute>
      <Transition mode="slide-right">
        <CreateBlog />
      </Transition>
    </ProtectedRoute>
  );
};

export default CreateBlogPage;
