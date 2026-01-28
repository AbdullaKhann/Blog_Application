import { useParams } from "react-router-dom";

export default function Post() {
  const { id } = useParams();
  return (
    <div>
      <h1>Post #{id}</h1>
      <p>Post content goes here...</p>
    </div>
  );
}
