import { type NextPage } from "next";
import Head from "next/head";

import { api, type RouterOutputs } from "~/utils/api";
import { SignInButton, useUser } from "@clerk/nextjs";

const CreatePostWizard = () => {
  const { user } = useUser();

  if (!user) return null;

  return (
    <div className="flex w-full gap-3">
      <img
        src={user.profileImageUrl}
        alt="Profile Image"
        className="h-14 w-14 rounded-full"
      />
      <input
        placeholder="Type some emojis!"
        className="grow bg-transparent outline-none"
      />
    </div>
  );
};

type PostWithAuthor = RouterOutputs["posts"]["getAll"][number];
const PostView = ({ post, author }: PostWithAuthor) => {
  return (
    <div key={post.id} className="flex gap-3 border-b border-slate-400 p-4">
      <img
        src={author.profileImageUrl}
        alt="Profile Image"
        className="h-14 w-14 rounded-full"
      />
      <div className="flex flex-col">
        <div className="flex text-slate-300">
          <span>{`@${author.username}`}</span>
        </div>
        <span>{post.content}</span>
      </div>
    </div>
  );
};

const Home: NextPage = () => {
  const user = useUser();
  const { data, isLoading } = api.posts.getAll.useQuery();

  if (isLoading) return <div>Loading...</div>;
  if (!data) return <div>Something went wrong</div>;

  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex h-screen justify-center">
        <div className="h-full w-full border-x border-slate-400 md:max-w-2xl">
          <div className="border-b border-slate-400 p-4">
            {!user.isSignedIn && (
              <div className="flex justify-center">
                <SignInButton />
              </div>
            )}
            {user.isSignedIn && <CreatePostWizard />}
          </div>
          <div className="flex flex-col">
            {[...data, ...data].map((postWithAuthor) => (
              <PostView {...postWithAuthor} key={postWithAuthor.post.id} />
            ))}
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;
