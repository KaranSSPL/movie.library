'use client';

//libs
import { useRouter } from 'next/navigation'

//custom componet
import Footer from "@/components/ui/footer/footer";

function UserDashboard() {
  const router = useRouter()
  return (
    <>
      <div className="center">
        <h2>Your movie list is empty</h2>
        <button type="button" className="button button-green" onClick={() => router.push('/movies/create')}>
          Add a new movie
        </button>
      </div>
      <Footer/>
    </>
  );
}

export default UserDashboard;
