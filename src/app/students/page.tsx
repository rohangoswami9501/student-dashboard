import StudentsView from "@/views/Students/StudentsView";
import MainLayout from "@/components/MainLayout/MainLayout";

export default function StudentsPage() {
  return (
    <MainLayout>
      <StudentsView />
    </MainLayout>
  );
}