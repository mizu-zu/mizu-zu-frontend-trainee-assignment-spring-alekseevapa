import './NeedsRevision.css';

interface NeedsRevisionProps {
    missingFields: string[];
}

const NeedsRevision = ({ missingFields }: NeedsRevisionProps) => {
    if (!missingFields || missingFields.length === 0) {
        return null;
    }

    return (
        <div className='needs-revision-notif'>
            <div className='needs-revision-notif-header'>
                <img 
                    src="/src/assets/icons/Attention.svg" 
                    className='needs-revision-notif-img' 
                    width={16} 
                    height={16} 
                    alt="attention"
                />
                <p>Требуются доработки</p>
            </div>

            <div className='needs-revision-notif-charact'>
                <p>У объявления не заполнены поля:</p>
                <ul className="characteristics-list">
                    {missingFields.map((item, index) => (
                        <li key={index}> {item}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default NeedsRevision;