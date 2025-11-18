import { useForm } from "react-hook-form";
import { supabase } from "../supabaseClient";
import { useChatStore } from "../store/chatStore";

interface RoomFormData {
  name: string;
}

function CreateRoom() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RoomFormData>();

  const onSubmit = async (data: RoomFormData) => {
    const { error, data: newRoom } = await supabase
      .from("rooms")
      .insert([
        {
          name: data.name,
        },
      ])
      .select();

    if (error) {
      throw Error(error.message);
    } else {
      const room = newRoom[0];
      useChatStore.getState().setCurrentRoom({ id: room.id, name: room.name });
    }
  };

  return (
    <div className="create-room-container">
      {" "}
      <div className="create-room">
        <h2>Create your Room</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <input
              type="text"
              placeholder="Enter room name"
              {...register("name", { required: "Enter the room name" })}
            ></input>
          </div>
          <button type="submit">Create a Room</button>
        </form>
      </div>
    </div>
  );
}
export default CreateRoom;
