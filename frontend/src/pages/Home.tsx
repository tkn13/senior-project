import { useAuth } from "../hook/useAuth";

export function Home(){
    const { user } = useAuth();
    return (
        <div>
            Hello {user}
        </div>
    )
}