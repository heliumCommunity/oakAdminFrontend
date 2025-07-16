import DashboardLayout from "@/components/Layout/Dashboard/DashboardLayout";
import CreateOrderForm from "@/components/forms/CreateOrderForm"; // create this if you haven’t

const CreateOrderPage = () => {
  return (
    <DashboardLayout>
      <CreateOrderForm />
    </DashboardLayout>
  );
};

export default CreateOrderPage;
