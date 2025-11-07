import { cards } from '../../../lib/dashboardCardData'

// Dashboard card component
const DashCard = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-5 tracking-widest">
      {/* Render each card */}
      {cards.map((card) => {
        // Get the icon component
        const Icon = card.icon
        return (
          <div key={card.id} className="card shadow-md bg-white rounded-lg">
            <div className="card-body">
              <h2 className="font-semibold flex justify-between tracking-normal">
                {card.title}
                {Icon && (
                  <Icon
                    size={20}
                    className={
                      card.title === 'High Risk Patients'
                        ? 'text-red-500'
                        : card.title === 'Patients Under Monitoring'
                          ? 'text-yellow-600'
                          : 'text-gray-600'
                    }
                  />
                )}
              </h2>
              <p
                className={`text-2xl font-extrabold ${
                  card.title === 'High Risk Patients'
                    ? 'text-red-500'
                    : card.title === 'Patients Under Monitoring'
                      ? 'text-yellow-600'
                      : 'text-black'
                }`}
              >
                {card.count}
                <span className="block font-normal text-xs text-gray-600 tracking-normal">
                  {card.detail}
                </span>
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default DashCard
