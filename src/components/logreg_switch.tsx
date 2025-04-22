import { motion } from 'framer-motion';

type ToggleSwitchProps = {
  isActive: boolean;
  onToggle: () => void;
};

const ToggleSwitch = ({ isActive, onToggle }: ToggleSwitchProps) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2 justify-center">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onToggle()}
          className={`w-full px-4 py-1 rounded-full font-medium transition-colors ${
            isActive
              ? 'bg-gray text-gray-200 hover:bg-yellow-100 hover:text-green hover:border hover:border-green'
              : 'bg-green text-white'
          }`}
          disabled={!isActive}
        >
          Login
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onToggle()}
          className={`w-full px-4 py-1 rounded-full font-medium transition-colors ${
            !isActive
              ? 'bg-gray text-gray-200 hover:bg-yellow-100 hover:text-green hover:border hover:border-green'
              : 'bg-green text-white'
          }`} 
          disabled={isActive}
        >
          Register
        </motion.button>
      </div>
    </div>
  );
}

export default ToggleSwitch;