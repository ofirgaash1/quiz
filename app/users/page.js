import deleteUser from "@/app/actions/deleteUser"
import usersOnDB from "@/app/actions/usersOnDB"
import { currentUserID } from "../actions/currentUserID";
async function page() {
    // update neon users table:
    const userID = await currentUserID()

    const usersFromPrisma = await usersOnDB()

    return (
        <>
            {usersFromPrisma.map(user => (
                <div className="p-3" key={user.id}>
                    <p>
                        <span>User Name:</span> <span className="bg-amber-100"> {user.username} </span>
                    </p>
                    <p>
                        <span>Email Address:</span> <span className="bg-amber-100"> {user.email} </span>
                    </p>
                    <p>
                        <span>User ID:</span> <span className="bg-amber-100"> {user.id} </span>
                    </p>
                    <form action={deleteUser}>
                        <input type="hidden" name="user.id" value={user.id} />
                        <button type="submit" className="bg-red-400 rounded-xl p-2">Delete</button>
                    </form>
                </div>
                )
            )}
            your user id: {userID}
        </>
    );
}

export default page;