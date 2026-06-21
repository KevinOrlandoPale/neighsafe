interface Props {
  user:any;
  onEdit:()=>void;
}

export default function ProfileHeader({
  user,
  onEdit
}:Props){

return(

<div className="flex flex-col md:flex-row items-center justify-between gap-4">

<div className="flex items-center gap-4">

<img
src={
user.avatar||
`https://ui-avatars.com/api/?name=${user.first_name}`
}
className="
w-20
h-20
rounded-full
object-cover
"
/>

<div>

<h1 className="text-xl text-white font-semibold">
{user.first_name}
{" "}
{user.last_name}
</h1>

<p className="text-gray-400">
{user.city}
</p>

</div>

</div>

<button
onClick={onEdit}
className="
px-5
py-2
rounded-xl
bg-gradient-to-r
from-blue-600
to-cyan-500
text-white
"
>
Editar Perfil
</button>

</div>

)

}