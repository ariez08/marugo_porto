interface SubTitleProps {
    text: string;
    className?: string;
}

const SubTitle: React.FC<SubTitleProps> = ({text, className=""}) => {
  return (
    <div className={`px-3 text-white text-nowrap bg-blue border-4 border-white rounded-custom w-min ${className}`}>
        <h1 className="font-magnifico uppercase tracking-wide">{text}</h1>
    </div>
  )
}

export default SubTitle