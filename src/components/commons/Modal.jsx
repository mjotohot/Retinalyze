import { forwardRef } from 'react'

// Modal component using forwardRef to allow parent components to control its visibility
const Modal = forwardRef(
  ({ title, message, confirmLabel, onConfirm, color }, ref) => {
    return (
      <dialog ref={ref} className="modal">
        <div className="modal-box">
          <button
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            onClick={() => ref?.current?.close()}
          >
            ✕
          </button>
          <h3 className="font-bold">{title}</h3>
          <p className="py-4">{message}</p>
          <div className="flex justify-end space-x-2">
            <button
              className={`btn ${color} text-white`}
              onClick={() => {
                onConfirm?.()
                ref?.current?.close()
              }}
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      </dialog>
    )
  }
)

export default Modal
