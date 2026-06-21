interface Props{
title:string
content:any
isInfoList?:boolean
}

export default function InfoCard({
title,
content,
isInfoList
}:Props){

return(

<div
className="
p-6
rounded-2xl
bg-white/5
backdrop-blur-lg
border
border-white/10
"
>

<h2 className="text-white mb-4 font-semibold">

{title}

</h2>

{
isInfoList
?

<div className="space-y-2 text-gray-300">

<p>
📧 {content.email}
</p>

<p>
📍 {content.city}
</p>

</div>

:

<p className="text-gray-300">
{content}
</p>

}

</div>

)

}