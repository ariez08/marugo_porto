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
              ? 'bg-green text-white'
              : 'bg-yellow-200 text-gray hover:bg-yellow-100'
          }`}
        >
          Login
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onToggle()}
          className={`w-full px-4 py-1 rounded-full font-medium transition-colors ${
            !isActive
              ? 'bg-green text-white'
              : 'bg-yellow-200 text-gray hover:bg-yellow-100'
          }`} 
        >
          Register
        </motion.button>
      </div>
    </div>
  );
}

export default ToggleSwitch;